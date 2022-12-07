import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setFacebookUnread } from '../../../../../../store/slices/customerSlice';

function findContactIDFromConversation(participants, userID, dispatch) {
    // eslint-disable-next-line no-restricted-syntax
    for (const participant of participants) {
        if (participant.id !== userID) {
            dispatch(setSelectedContactID(participant.id));
        }
    }
}

export const getUserChatData = createAsyncThunk(
    'chat/facebook/getUserChatData',
    async ({ conversation, selectedFacebookPage }, { dispatch, getState }) => {
        axios
            .get(
                `https://graph.facebook.com/v14.0/${conversation.participants.data[0].id}/?fields=birthday,name,email,gender,link,location&access_token=${selectedFacebookPage.access_token}`
            )
            .then(response => {
                dispatch(setUserChatData(response.data));
            });
    }
);
export const getSocialConvIdsFace = createAsyncThunk(
    'chat/facebook/getSocialConvIdsFace',
    async ({ social_media }, { dispatch, getState }) => {
        axios
            .get(
                `${process.env.REACT_APP_LOCAL_URL}/mobichat/social_media/get_assigned_conv/?social_media=${social_media}`
            )
            .then(res => {
                dispatch(setSocialConvIdsFace(res.data));
            });
    }
);

export const setReadMessagesFacebook = createAsyncThunk(
    'chat/facebook/setReadMessagesFacebook',
    async ({ social_media, unread_count, chat_id, unreadFacebook }, { dispatch, getState }) => {
        const data = {
            social_media,
            chat_id
        };
        axios.post(`${process.env.REACT_APP_LOCAL_URL}/mobichat/social_media/set_read_messages/`, data).then(res => {
            if (res.status === 200) {
                dispatch(setFacebookUnread(unreadFacebook - unread_count > 0 ? unreadFacebook - unread_count : 0));
                dispatch(getSocialConvIdsFace({ social_media: 'Facebook' }));
            }
        });
    }
);

export const getFacebookConversation = createAsyncThunk(
    'chat/facebook/getFacebookConversation',
    async (
        { conversation, selectedFacebookPage, socketContext, chat_id, custom, unread_count, assign_user },
        { dispatch, getState }
    ) => {
        findContactIDFromConversation(
            conversation.participants.data,
            getState().facebook.facebook.selectedFacebookPage.id,
            dispatch
        );

        dispatch(setSelectedConversation(conversation));

        axios
            .get(
                `https://graph.facebook.com/v14.0/${conversation.id}/?fields=
                messages{message,created_time,from,to,id,attachments},subject,wallpaper,updated_time,id
                &access_token=${selectedFacebookPage.access_token}`
            )
            .then(
                response => {
                    dispatch(setChatDialog(response.data.messages.data.reverse()));
                    if (assign_user && unread_count > 0) {
                        custom.unread_count = unread_count;
                        socketContext.socket.socialMessageSeen(chat_id, custom);
                    }
                },
                error => {
                    console.log('accountsError', error);
                }
            );
    }
);

function map_profile_photo_ids(fb_resp) {
    return fb_resp.conversations.data
        .map(item => item)
        .map(el => Object({ conversationID: el.id, KonusulankisiID: el.participants.data[0].id }));
}

export const conversationProfilePictureMap = createAsyncThunk(
    'chat/facebook/conversationProfilePictureMap',
    async ({ id, access_token }) => {
        const response = await axios.get(
            `https://graph.facebook.com/v14.0/${id}?fields=
            conversations{participants,message_count,unread_count,updated_time},access_token,picture`,
            {
                params: {
                    access_token
                }
            }
        );
        const data = await response.data;

        const mapped = map_profile_photo_ids(data);

        return mapped;
    }
);

export const getAccountFacebookConversationProfilePicture = createAsyncThunk(
    'chat/facebook/getAccountFacebookConversationProfilePicture',

    async ({ id, access_token }) => {
        const response = await axios.get(`https://graph.facebook.com/v14.0/${id}/?fields=profile_pic`, {
            params: {
                access_token
            }
        });

        return response.data;
    }
);

export const getAccountFacebookContactAllPictures = createAsyncThunk(
    'chat/facebook/getAccountFacebookContactAllPictures',
    async ({ ids, access_token }, { dispatch, getState }) => {
        const getProfilePhotos = JSON.parse(window.localStorage.getItem('faceProfilePhotos'));
        const idsSize = ids.split(',').length;

        if (idsSize !== Object.keys(getProfilePhotos || []).length) {
            response = await axios

                .get(
                    `https://graph.facebook.com/v14.0/picture?ids=${ids}&redirect=false&type=large&access_token=${access_token}`
                )
                .then(response => {
                    window.localStorage.setItem('faceProfilePhotos', JSON.stringify(response.data));
                });

            return response.data;
        }
    }
);

export const sendFacebookFile = createAsyncThunk('chat/facebook/sendFacebookFile', async ({ file }, { getState }) => {
    let data = '';
    if (getState().facebook.facebook.selectedFacebookPage) {
        if (getState().facebook.facebookChat.selectedConversation) {
            var newFile = new FormData();

            let type = file['type'].split('/')[0];
            if (type === 'application') {
                type = 'file';
            }

            const recipientFacebook = {
                id: getState().facebook.facebookChat.selectedContactID
            };

            const messageFacebook = {
                attachment: {
                    type: type,
                    payload: {
                        is_reusable: true
                    }
                }
            };

            newFile.append('filedata', file);
            newFile.append('recipient', JSON.stringify(recipientFacebook));
            newFile.append('message', JSON.stringify(messageFacebook));
            const response = await axios({
                url: `https://graph.facebook.com/v14.0/me/messages?access_token=${
                    getState().facebook.facebook.selectedFacebookPage.pageToken
                }`,
                method: 'POST',
                data: newFile,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            data = await response.data;

            return data;
        }
    }
    return data;
});

export const sendFacebookMessage = createAsyncThunk(
    'chat/facebook/sendFacebookMessage',
    async ({ messageText }, { getState }) => {
        if (messageText.length) {
            if (getState().facebook.facebook.selectedFacebookPage) {
                if (getState().facebook.facebookChat.selectedConversation) {
                    const response = await 
                    axios
                    .post(
                        `https://graph.facebook.com/v14.0/me/messages?access_token=${
                            getState().facebook.facebook.selectedFacebookPage.pageToken
                        }`,

                        {
                            recipient: {
                                id: getState().facebook.facebookChat.selectedContactID
                            },
                            message: {
                                text: messageText
                            },
                            tag: 'HUMAN_AGENT'
                        },

                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    const data = await response.data;
                    return data;
                }
            }
        }
    }
);

const facebookChatSlice = createSlice({
    name: 'chatApp/facebook/chat',
    initialState: {
        conversations: [],
        contactSearchText: '',
        chatDialog: [],
        selectedConversation: {},
        chatSearchText: '',
        UserChatData: {},
        selectedContactID: '',
        accountConversitationPictirueId: [],
        conversationProfilePictureMapValue: [],
        selectedProfilePicture: '',
        socialConvIds: [],
        selectedSearchedMessage: {}
    },

    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setSelectedProfilePicture: (state, action) => {
            state.selectedProfilePicture = action.payload;
        },
        setContactSearchText: (state, action) => {
            state.contactSearchText = action.payload;
        },
        setChatDialog: (state, action) => {
            state.chatDialog = action.payload;
        },
        setSelectedSearchedMessage: (state, action) => {
            state.selectedSearchedMessage = action.payload;
        },
        setSelectedConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
        setUserChatData: (state, action) => {
            state.UserChatData = action.payload;
        },
        setSocialConvIdsFace: (state, action) => {
            state.socialConvIds = action.payload;
        },
        setAccountConversitationPictirueId: (state, action) => {
            state.accountConversitationPictirueId = action.payload;
        },
        setConversationProfilePictureMapValue: (state, action) => {
            state.conversationProfilePictureMapValue = action.payload;
        },
        setChatSearchText: (state, action) => {
            state.chatSearchText = action.payload;
        },
        setSelectedContactID: (state, action) => {
            state.selectedContactID = action.payload;
        }
    },

    extraReducers: {
        // [sendFacebookFile.fulfilled]: (state, action) => {
        //     state.dialog = [...state.dialog, action.payload];
        // },
    }
});

export const {
    setConversations,
    setContactSearchText,
    setChatDialog,
    setUserChatData,
    setSelectedConversation,
    setChatSearchText,
    setSelectedContactID,
    setSelectedSearchedMessage,
    setAccountConversitationPictirueId,
    setConversationProfilePictureMapValue,
    setSelectedProfilePicture,
    setSocialConvIdsFace
} = facebookChatSlice.actions;

export default facebookChatSlice.reducer;
