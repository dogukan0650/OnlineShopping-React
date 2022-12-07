/* eslint-disable unused-imports/no-unused-vars */
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { SocketContext } from 'app/socket';
import axios from 'axios';
import clsx from 'clsx';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import fileDownload from 'js-file-download';
import * as React from 'react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    ControlBar,
    CurrentTimeDisplay,
    ForwardControl,
    LoadingSpinner,
    PlaybackRateMenuButton,
    Player,
    ReplayControl,
    TimeDivider,
    VolumeMenuButton
} from 'video-react';
import '../../../../../../../styles/video-react.css';
import { setRefreshAssignedUser } from '../../../../../../store/slices/customerSlice';
import {
    getSocialConvIdsFace,
    sendFacebookFile,
    sendFacebookMessage,
    setChatSearchText,
    setSelectedSearchedMessage,
    setSocialConvIdsFace
} from '../store/facebookChatSlice';

const useStyles = makeStyles(theme => ({
    messageRow: {
        '&.contact': {
            '& .bubble': {
                backgroundColor: '#ebf4f7',
                color: '#404040',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
                maxWidth: 750,
                maxHeight: 3000,

                '& .time': {
                    marginLeft: 12
                }
            },
            '&.first-of-group': {
                '& .bubble': {
                    borderTopLeftRadius: 20
                }
            },
            '&.last-of-group': {
                '& .bubble': {
                    borderBottomLeftRadius: 20
                }
            }
        },
        '&.me': {
            marginLeft: 'auto',

            '& .avatar': {
                order: 2,
                margin: '0 0 0 16px'
            },
            '& .bubble': {
                marginLeft: 'auto',
                backgroundColor: '#ebe6f5',
                color: '#404040',
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                maxWidth: 750,
                maxHeight: 3000,

                '& .time': {
                    justifyContent: 'flex-end',
                    right: 0
                }
            },
            '&.first-of-group': {
                '& .bubble': {
                    borderTopRightRadius: 20
                }
            },

            '&.last-of-group': {
                '& .bubble': {
                    borderBottomRightRadius: 20
                }
            }
        },
        '&.contact + .me, &.me + .contact': {
            paddingTop: 20,
            marginTop: 20
        },
        '&.first-of-group': {
            '& .bubble': {
                borderTopLeftRadius: 20,
                paddingTop: 13
            }
        },
        '&.last-of-group': {
            '& .bubble': {
                borderBottomLeftRadius: 20,
                paddingBottom: 12,
                '& .time': {
                    display: 'flex'
                }
            }
        }
    }
}));

function FacebookChat(props) {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation('chat');
    const chatRef = useRef(null);
    const classes = useStyles();
    const facebookChatDialogTemp = useSelector(({ facebook }) => facebook.facebookChat.chatDialog);
    const facebookSelectedConversation = useSelector(({ facebook }) => facebook.facebookChat.selectedConversation);
    const socialConvIds = useSelector(({ facebook }) => facebook.facebookChat.socialConvIds);
    const userID = useSelector(({ facebook }) => facebook.facebook.userID);
    const selectedProfilePicture = useSelector(({ facebook }) => facebook.facebookChat.selectedProfilePicture);
    const user_role = useSelector(({ profile }) => profile.user.i_role__name);
    const i_user = useSelector(({ profile }) => profile.user.pk);
    const pageID = useSelector(({ facebook }) => facebook.facebook.selectedFacebookPage.id);
    const searchedValue = useSelector(({ facebook }) => facebook.facebookChat.chatSearchText);
    const userList = JSON.parse(window.localStorage.getItem('usersList')).filter(
        item => item.is_active && item.userinfo__is_use_social_media
    );

    const socialConvIdsFace = useSelector(({ facebook }) => facebook.facebookChat.socialConvIds);
    // const [socialConvIdsFace ,setSocialConvIdsFace] = useState(socialConvIdsFaceTmp);
    const unreadFacebook = useSelector(({ profile }) => profile.customer.unreadFacebook);
    const [hookData, setHookData] = useState('');
    const [refresh, setRefresh] = useState('');
    const [hoookCustom, setHookDataCustom] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);
    const messageAnchorRef = useRef([]);
    const [messageText, setMessageText] = useState('');
    const [loadingFile, setLoadingFile] = useState(false);
    const [facebookChatDialog, setFacebookChatDialog] = useState(facebookChatDialogTemp);
    const assignedUserChanged = useSelector(({ profile }) => profile.customer.refreshAssignedUser);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [isWrireteMessage, setIsWrireteMessage] = useState(true);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState('');
    const [threeDotAnchorEl, setThreeDotAnchorEl] = useState(null);
    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');
    const [imageType, setImageType] = useState('');
    const socketContext = useContext(SocketContext);
    const [unreadConv, setUnreadConv] = useState(0);
    const accountPages = useSelector(({ facebook }) => facebook.facebook.accountPages);
    const user = useSelector(({ profile }) => profile.user.pk);
    const dialogMessage = '';
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const humanFileSize = size => {
        const i = Math.floor(Math.log(size) / Math.log(1024));

        return `${(size / Math.pow(1024, i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
    };
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const selectedSearchedMessage = useSelector(({ facebook }) => facebook.facebookChat.selectedSearchedMessage);
    let searchedMessageRef = useRef(null);

    const handleDownload = (url, filename) => {
        axios
            .get(url, {
                responseType: 'blob'
            })
            .then(res => {
                fileDownload(res.data, filename);
            });
    };

    useEffect(() => {
        const found = socialConvIds.find(
            item =>
                item.chat_id ===
                facebookSelectedConversation?.participants?.data[0].id +
                    '_' +
                    facebookSelectedConversation?.participants?.data[1].id
        );
        if (!found || found?.user === user || found?.user === -1 || ['root', 'admin'].includes(user_role)) {
            setIsWrireteMessage(true);
        } else if (
            assignedUserChanged &&
            assignedUserChanged.user !== user &&
            assignedUserChanged.user !== -1 &&
            !['root', 'admin'].includes(user_role)
        ) {
            setIsWrireteMessage(false);
            dispatch(setRefreshAssignedUser(''));
        }
    }, [assignedUserChanged, socialConvIds]);

    socketContext.socket.on_webhook_message = (event, data, custom) => {
        const convIdTemp = data.entry[0].messaging[0].sender.id;
        const convRevIdTmp = data.entry[0].messaging[0].recipient.id;

        const cahat_id = convIdTemp + '_' + convRevIdTmp;

        let tmpSocialConvIdsFace = JSON.parse(JSON.stringify(socialConvIdsFace));

        tmpSocialConvIdsFace = tmpSocialConvIdsFace.map(item => {
            if (item.chat_id === cahat_id) {
                item.unread_count = custom.unread_count;
            }
            return item;
        });
        // setSocialConvIdsFace(tmpSocialConvIdsFace)
        dispatch(setSocialConvIdsFace(tmpSocialConvIdsFace));
        if (data.entry[0].messaging[0].sender.id === facebookSelectedConversation.participants.data[0].id) {
            const datatemp = data.entry[0].messaging[0];

            let tmp = {};

            if (datatemp.message.attachments) {
                const type = datatemp.message.attachments[0].type;
                let tempdata = {};

                if (type === 'image') {
                    tempdata = {
                        image_data: { url: datatemp.message.attachments[0].payload.url }
                    };
                } else if (type === 'video') {
                    tempdata = {
                        video_data: { url: datatemp.message.attachments[0].payload.url }
                    };
                } else if (type === 'file') {
                    axios.get(`${datatemp.message.attachments[0].payload.url}`).then(res => {
                        const filename = res.headers['content-disposition'].split('filename=')[1];
                        const filesize = humanFileSize(res.headers['content-length']);
                    });

                    tempdata = {
                        file_url: datatemp.message.attachments[0].payload.url,
                        size: filesize,
                        name: filename
                    };
                }

                tmp = {
                    attachments: { data: [tempdata] },
                    // message: datatemp.message.text,
                    id: datatemp.mid,
                    from: datatemp.sender,
                    to: datatemp.recipient
                };
            } else {
                tmp = {
                    message: datatemp.message.text,
                    id: datatemp.mid,
                    from: datatemp.sender,
                    to: datatemp.recipient
                };
            }

            const tmp2 = JSON.parse(JSON.stringify(facebookChatDialog));
            tmp2.push(tmp);
            setFacebookChatDialog(tmp2);
        }
    };

    const findConvAssignUser = id => {
        const found = socialConvIdsFace.find(item => item.chat_id === id?.toString());
        if (found) {
            const tmpuser = userList.find(item => item.i_user.toString() === found?.user?.toString());
            if (tmpuser?.i_user === i_user) {
                return true;
            }
        }
    };

    useEffect(() => {
        if (
            assignedUserChanged.chat_id ===
                facebookSelectedConversation?.participants?.data[0].id +
                    '_' +
                    facebookSelectedConversation?.participants?.data[1].id ||
            !assignedUserChanged
        ) {
            dispatch(getSocialConvIdsFace({ social_media: 'Facebook' }));
        }
        findAssignConv();
    }, [assignedUserChanged]);

    const findAssignConv = () => {
        const found = socialConvIds.find(
            item =>
                item.chat_id ===
                facebookSelectedConversation?.participants?.data[0].id +
                    '_' +
                    facebookSelectedConversation?.participants?.data[1].id
        );
        if (found) {
            if (found?.user !== user && found?.user !== -1 && !['root', 'admin'].includes(user_role)) {
                setIsWrireteMessage(false);
            }
        }
    };

    // Dosya gönderme facebookChatSlice.js'e gidiyor
    const inputFile = useRef(null);
    const handleFileChange = e => {
        setLoadingFile(true);
        Array.from(e.target.files).forEach(file => {
            dispatch(
                sendFacebookFile({
                    file
                }) //deneme
            ).then(res => {
                const file = res.payload;
                setLoadingFile(false);
                const tmp = {
                    file: file
                };
            });
        });

        inputFile.current.value = '';
    };

    function sendFacebookHeart(ev) {
        ev.preventDefault();
        let messageText = '❤';
        dispatch(sendFacebookMessage({ messageText })).then(res => {});
        dispatch(setChatSearchText(''));
        setMessageText('');
    }

    function onMessageSubmit(ev) {
        ev.preventDefault();

        if (messageText === '') {
            return;
        }

        dispatch(sendFacebookMessage({ messageText })).then(res => {});
        dispatch(setChatSearchText(''));
        setMessageText('');
    }

    useEffect(() => {
        if (
            facebookChatDialog &&
            !facebookChatDialog.scrollUp &&
            !facebookChatDialog.scrollDown &&
            !searchedValue.length
        ) {
            scrollToBottom();
        }
    }, [facebookChatDialog]);

    function scrollToBottom() {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }

    function shouldShowContactAvatar(item, i) {
        return (
            item.from.id !== pageID &&
            ((facebookChatDialog[i + 1] && facebookChatDialog[i + 1].who !== facebookSelectedConversation.id) ||
                !facebookChatDialog[i + 1])
        );
    }

    const handleClick = (event, messageId, message, seenBy) => {
        setSelectedMessageId(messageId);
        setSelectedMessage(message);
        setThreeDotAnchorEl(messageAnchorRef.current[messageId]);
    };

    function onInputChange(ev) {
        setMessageText(ev.target.value);
    }

    const openEmojiMenu = event => {
        setEmojiAnchorEl(event.currentTarget);
    };
    const closeEmojiMenu = event => {
        setEmojiAnchorEl(null);
    };
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setMessageText(messageText + emojiObject.emoji);
        setEmojiAnchorEl(null);
    };

    const handleKeyDown = event => {
        if (event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            onMessageSubmit(event);
        }
    };
    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleFacebookfile = url => {
        download(url);
    };

    useEffect(() => {
        if (selectedSearchedMessage && searchedMessageRef) {
            searchedMessageRef.current !== null &&
                searchedMessageRef?.scrollIntoView({
                    behavior: 'auto'
                });
        }

        dispatch(setSelectedSearchedMessage(''));
    }, [selectedSearchedMessage, searchedMessageRef]);

    //url check etme
    const validURL = str => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator

        return str ? str.startsWith('http://') || str.startsWith('https://') : false;
    };
    const optionsTime = {
        hour: 'numeric',
        minute: 'numeric'
    };
    const optionsDate = {
        // weekday: 'long',
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
    };

    function isFirstMessageOfGroup(item, i) {
        return i === 0 || (facebookChatDialog[i - 1] && facebookChatDialog[i - 1].from.id !== item.from.id);
    }

    function isLastMessageOfGroup(item, i) {
        return (
            i === facebookChatDialog.length - 1 ||
            (facebookChatDialog[i + 1] && facebookChatDialog[i + 1].from.id !== item.from.id)
        );
    }

    const UnreadCount = facebookSelectedConversation => {
        const id =
            facebookSelectedConversation?.participants?.data[0].id +
            '_' +
            facebookSelectedConversation?.participants?.data[1].id;
        const found = socialConvIdsFace.find(item => item.chat_id === id?.toString());
        let count = 0;

        if (hookData) {
            const idTmp = hookData.entry[0].messaging[0].sender.id + '_' + hookData.entry[0].messaging[0].recipient.id;
            if (idTmp === id) {
                count = hoookCustom.unread_count;
            }
        }
        if (found) {
            count = found.unread_count;
        }
        return count;
    };

    const setRead = facebookSelectedConversation => {
        const chat_id =
            facebookSelectedConversation?.participants?.data[0].id +
            '_' +
            facebookSelectedConversation?.participants?.data[1].id;
        const unread_count = UnreadCount(facebookSelectedConversation);
        setUnreadConv(unread_count);
        if (findConvAssignUser(chat_id)) {
            const custom = { social_media: 'Facebook' };
            // const unread_count = UnreadCount(conversations);
            socketContext.socket.socialMessageSeen(chat_id, custom);

            dispatch(setFacebookUnread(unreadFacebook - unread_count > 0 ? unreadFacebook - unread_count : 0));
            dispatch(getSocialConvIdsFace({ social_media: 'Facebook' }));
        }
    };
    return (
        <>
            <div className={clsx('flex flex-col relative', props.className)}>
                <div
                    ref={chatRef}
                    // onScroll={e => handleScroll(e)}
                    className="flex flex-1 flex-col overflow-y-auto"
                    style={{ borderLeft: '1px solid #dadde1' }}
                >
                    {facebookChatDialog && facebookChatDialog.length && (
                        <div className="flex flex-col pt-4 relative px-4">
                            {facebookChatDialog
                                .filter(it => !!it)
                                .map((dialogMessage, index, arr) => {
                                    return (
                                        <>
                                            {console.log('dialogMessagedialogMessage', dialogMessage)}
                                            {index === 0 ? (
                                                <Typography
                                                    className="flex text-center justify-center  items-center"
                                                    style={{
                                                        fontSize: 'large'
                                                    }}
                                                    color={'#404040'}
                                                >
                                                    {dialogMessage?.created_time
                                                        ? new Date(dialogMessage.created_time).toLocaleDateString(
                                                              'tr-TR',
                                                              optionsDate
                                                          )
                                                        : ''}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    className="flex text-center justify-center items-center"
                                                    style={{
                                                        fontSize: 'large'
                                                    }}
                                                    color={'#404040'}
                                                >
                                                    {arr[index - 1]?.created_time && arr[index]?.created_time
                                                        ? arr[index - 1]?.created_time
                                                              ?.split('T')[0]
                                                              .toString()
                                                              .includes(
                                                                  dialogMessage.created_time?.split('T')[0].toString()
                                                              )
                                                            ? ''
                                                            : new Date(dialogMessage.created_time).toLocaleDateString(
                                                                  'tr-TR',
                                                                  optionsDate
                                                              )
                                                        : ''}
                                                </Typography>
                                            )}
                                            <div
                                                key={dialogMessage.id}
                                                className={clsx(
                                                    classes.messageRow,
                                                    'flex flex-col items-start  justify-end relative px-16 pb-4 mt-4',
                                                    { me: dialogMessage.from.id === pageID },
                                                    { contact: dialogMessage.from.id !== pageID },
                                                    { 'first-of-group': isFirstMessageOfGroup(dialogMessage, index) },
                                                    { 'last-of-group': isLastMessageOfGroup(dialogMessage, index) },
                                                    index + 1 === dialogMessage.length && 'pb-96'
                                                )}
                                                ref={ref => {
                                                    if (
                                                        selectedSearchedMessage?.content?.text ===
                                                        dialogMessage?.content?.text
                                                    ) {
                                                        searchedMessageRef = ref;
                                                    }
                                                }}
                                                // ref={ref => {
                                                //     messageAnchorRef.current[dialogMessage.id] = ref;
                                                // }}
                                            >
                                                <Box display="flex" flexDirection="row">
                                                    <Box>
                                                        {shouldShowContactAvatar(dialogMessage, index) &&
                                                            isLastMessageOfGroup(dialogMessage, index) && (
                                                                <Tooltip title={facebookSelectedConversation.name}>
                                                                    <Avatar
                                                                        style={{ width: '40px', height: '40px' }}
                                                                        alt={facebookSelectedConversation.name}
                                                                        src={selectedProfilePicture}
                                                                    />
                                                                </Tooltip>
                                                            )}
                                                    </Box>

                                                    <Box
                                                        display="flex"
                                                        flexDirection="column"
                                                        style={{ maxWidth: '100%' }}
                                                    >
                                                        <Box style={{ maxWidth: '100%' }}>
                                                            <div
                                                                className="bubble flex relative  items-center justify-center pl-12 pt-12 pr-12 pb-12 max-w-full shadow"
                                                                style={{
                                                                    marginLeft: isLastMessageOfGroup(
                                                                        dialogMessage,
                                                                        index
                                                                    )
                                                                        ? 20
                                                                        : 60,
                                                                    display: 'inline-block',
                                                                    whiteSpace: 'normal',
                                                                    wordWrap: 'break-word'
                                                                }}
                                                            >
                                                                <Box className="flex flex-row">
                                                                    {dialogMessage.attachments ? (
                                                                        dialogMessage.attachments.data[0].image_data ? (
                                                                            <div>
                                                                                <img
                                                                                    className="bubble"
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    src={
                                                                                        dialogMessage.attachments
                                                                                            .data[0].image_data.url
                                                                                    }
                                                                                    height={250}
                                                                                    width={250}
                                                                                    onClick={e => {
                                                                                        handleOpen(),
                                                                                            setImage(
                                                                                                dialogMessage
                                                                                                    .attachments.data[0]
                                                                                                    .image_data.url
                                                                                            );
                                                                                        setImageName(
                                                                                            dialogMessage.attachments
                                                                                                .data[0].name
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ) : dialogMessage.attachments.data[0]
                                                                              .video_data ? (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 350,
                                                                                    height: 300
                                                                                }}
                                                                            >
                                                                                <Player
                                                                                    fluid={false}
                                                                                    width={350}
                                                                                    height={300}
                                                                                    aspectRatio="auto"
                                                                                    poster={
                                                                                        dialogMessage.attachments
                                                                                            .data[0].video_data
                                                                                            .preview_url
                                                                                    }
                                                                                    src={
                                                                                        dialogMessage.attachments
                                                                                            .data[0].video_data.url
                                                                                    }
                                                                                >
                                                                                    <LoadingSpinner />
                                                                                    <ControlBar>
                                                                                        <ReplayControl
                                                                                            seconds={10}
                                                                                            order={1.1}
                                                                                        />
                                                                                        <ForwardControl
                                                                                            seconds={30}
                                                                                            order={1.2}
                                                                                        />
                                                                                        <CurrentTimeDisplay
                                                                                            order={4.1}
                                                                                        />
                                                                                        <TimeDivider order={4.2} />
                                                                                        <PlaybackRateMenuButton
                                                                                            rates={[5, 2, 1, 0.5, 0.1]}
                                                                                            order={7.1}
                                                                                        />
                                                                                        <VolumeMenuButton disabled />
                                                                                    </ControlBar>
                                                                                </Player>
                                                                            </Box>
                                                                        ) : (
                                                                            <div className="leading-tight whitespace-normal">
                                                                                <Box className="flex flex-row">
                                                                                    {dialogMessage.attachments.data[0]
                                                                                        .file_url ? (
                                                                                        <Button
                                                                                            style={{
                                                                                                color: 'white'
                                                                                            }}
                                                                                            onClick={() =>
                                                                                                window.open(
                                                                                                    dialogMessage
                                                                                                        .attachments
                                                                                                        .data[0]
                                                                                                        .file_url
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <img
                                                                                                className=" rounded-8 w-64 cursor-pointer "
                                                                                                src={`${
                                                                                                    process.env
                                                                                                        .PUBLIC_URL
                                                                                                }/assets/images/etc/fileicons/${dialogMessage.attachments.data[0].name
                                                                                                    .split('.')
                                                                                                    .slice(-1)[0]
                                                                                                    .toLowerCase()}.png`}
                                                                                                alt={
                                                                                                    dialogMessage
                                                                                                        .attachments
                                                                                                        .data[0].name
                                                                                                }
                                                                                                style={{
                                                                                                    width: '40px',
                                                                                                    height: '40px'
                                                                                                }}
                                                                                            />
                                                                                        </Button>
                                                                                    ) : null}
                                                                                    <Box className="flex flex-col">
                                                                                        {
                                                                                            dialogMessage.attachments
                                                                                                .data[0].name
                                                                                        }
                                                                                        <ImageList
                                                                                            className="cursor-pointer"
                                                                                            height={100}
                                                                                            width={100}
                                                                                        />
                                                                                        {dialogMessage.attachments
                                                                                            .data[0].size
                                                                                            ? humanFileSize(
                                                                                                  dialogMessage
                                                                                                      .attachments
                                                                                                      .data[0].size
                                                                                              )
                                                                                            : null}
                                                                                    </Box>
                                                                                </Box>
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <>
                                                                            <div
                                                                                className="inline-flex flex-col justify-start items-start"
                                                                                style={{
                                                                                    width: '100%',
                                                                                    wordWrap: 'break-word'
                                                                                }}
                                                                            >
                                                                                {validURL(dialogMessage.message) ? (
                                                                                    <a
                                                                                        href={
                                                                                            dialogMessage.message.startsWith(
                                                                                                'http'
                                                                                            )
                                                                                                ? dialogMessage.message
                                                                                                : `http://${dialogMessage.message}`
                                                                                        }
                                                                                        target="_blank"
                                                                                        rel="nofollow noreferrer"
                                                                                        style={{
                                                                                            backgroundColor:
                                                                                                'transparent',
                                                                                            textDecoration: 'underline',
                                                                                            border: 'none',
                                                                                            maxWidth: '100%'
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            className="flex items-center "
                                                                                            style={{
                                                                                                maxWidth: '100%',
                                                                                                display: 'inline-block',
                                                                                                whiteSpace: 'normal',
                                                                                                wordWrap: 'break-word'
                                                                                            }}
                                                                                        >
                                                                                            {dialogMessage.message}
                                                                                        </div>
                                                                                    </a>
                                                                                ) : (
                                                                                    <Typography
                                                                                        className="flex justify-start items-start "
                                                                                        style={{
                                                                                            color: searchedValue
                                                                                                ? dialogMessage.message
                                                                                                      .toLowerCase()
                                                                                                      .includes(
                                                                                                          searchedValue.toLowerCase()
                                                                                                      )
                                                                                                    ? '#2a94e9'
                                                                                                    : null
                                                                                                : null,
                                                                                            maxWidth: '100%',
                                                                                            display: 'inline-block',
                                                                                            whiteSpace: 'normal',
                                                                                            wordWrap: 'break-word',
                                                                                            fontSize: 'medium',
                                                                                            marginRight: '20px'
                                                                                        }}
                                                                                    >
                                                                                        {dialogMessage.message.length ==
                                                                                        0 ? (
                                                                                            t('MESSAGE_CANNOT_SHOWN')
                                                                                        ) : dialogMessage.message ===
                                                                                          '❤' ? (
                                                                                            <FavoriteIcon
                                                                                                sx={{ color: red[500] }}
                                                                                                style={{
                                                                                                    marginBottom: '5px'
                                                                                                }}
                                                                                                fontSize="large"
                                                                                            />
                                                                                        ) : dialogMessage.message
                                                                                              .length <= 4 ? (
                                                                                            dialogMessage.message.substring(
                                                                                                0,
                                                                                                4
                                                                                            ) + '  '
                                                                                        ) : (
                                                                                            dialogMessage.message
                                                                                        )}{' '}
                                                                                    </Typography>
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    <Typography
                                                                        className="time text-11 whitespace-normal absolute right-0 bottom-0 z-10"
                                                                        // style={{

                                                                        //     placeSelf: 'flex-end'
                                                                        // }}
                                                                        style={{
                                                                            marginBottom: '0',
                                                                            marginTop: 'auto'
                                                                        }}
                                                                        // style={{}}
                                                                        color="textSecondary"
                                                                    >
                                                                        {dialogMessage.created_time
                                                                            ? new Date(
                                                                                  dialogMessage.created_time
                                                                              ).toLocaleTimeString('tr-TR', optionsTime)
                                                                            : new Date().toLocaleTimeString(
                                                                                  'tr-TR',
                                                                                  optionsTime
                                                                              )}
                                                                    </Typography>
                                                                </Box>
                                                            </div>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    )}
                </div>

                {facebookChatDialog && (
                    <form
                        onSubmit={onMessageSubmit}
                        className=" bottom-0 right-0 "
                        style={{ borderLeft: '1px solid #dadde1' }}
                        disabled={!isWrireteMessage}
                    >
                        <Paper
                            className="flex items-center flex-col relative shadow"
                            style={{
                                margin: '15px',
                                borderRadius: '10px'
                            }}
                            disabled={!isWrireteMessage}
                            sx={{ border: 1, borderColor: '#dadde1' }}
                        >
                            <Menu
                                anchorEl={emojiAnchorEl}
                                keepMounted
                                disabled={!isWrireteMessage}
                                open={Boolean(emojiAnchorEl)}
                                onClose={closeEmojiMenu}
                            >
                                <Picker
                                    onEmojiClick={onEmojiClick}
                                    disableAutoFocus
                                    skinTone={SKIN_TONE_MEDIUM_DARK}
                                    groupNames={{ smileys_people: 'PEOPLE' }}
                                    native
                                />
                            </Menu>
                            <Box
                                style={{
                                    width: '100%'
                                }}
                            >
                                {loadingFile && (
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress color="secondary" />
                                    </Box>
                                )}
                                <TextField
                                    multiline
                                    variant="standard"
                                    autoFocus={false}
                                    id="message-input"
                                    className="flex-1"
                                    disabled={!isWrireteMessage}
                                    style={{
                                        width: '100%',
                                        borderRadius: '7px',
                                        padding: '5px',
                                        outline: 'none'
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Avatar style={{ width: '35px', height: '35px' }}>
                                                    <img src={accountPages[0]?.picture?.data.url}></img>
                                                </Avatar>
                                            </InputAdornment>
                                        ),
                                        disableUnderline: true,
                                        classes: {
                                            root: 'flex flex-grow flex-shrink-0 mx-12 rtl:ml-48 my-8',
                                            input: ''
                                        },
                                        placeholder: t('REPLY_MOBIKOB')
                                    }}
                                    InputLabelProps={{
                                        shrink: false,
                                        className: classes.bootstrapFormLabel
                                    }}
                                    onChange={onInputChange}
                                    onKeyDown={handleKeyDown}
                                    value={messageText}
                                />
                                <Divider variant="middle" />
                                <Box
                                    className="flex items-center flex-row relative shadow"
                                    style={{
                                        justifyContent: 'flex-end',
                                        marginRight: '10px',
                                        borderRadius: '15px',
                                        width: '100%'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'transparent' }}
                                        component="label"
                                        disabled={!isWrireteMessage}
                                        onClick={sendFacebookHeart}
                                    >
                                        <FavoriteIcon sx={{ color: red[500] }} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={!isWrireteMessage}
                                        style={{ backgroundColor: 'transparent' }}
                                        component="label"
                                        onClick={openEmojiMenu}
                                    >
                                        <InsertEmoticonIcon sx={{ color: '#252f3e' }} />
                                    </Button>
                                    <Button
                                        disabled={!isWrireteMessage}
                                        variant="contained"
                                        style={{ backgroundColor: 'transparent' }}
                                        component="label"
                                    >
                                        <AddToPhotosIcon sx={{ color: '#252f3e' }} />
                                        <input
                                            type="file"
                                            ref={inputFile}
                                            style={{ display: 'none' }}
                                            onChange={e => handleFileChange(e)}
                                            multiple
                                        />
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </form>
                )}
            </div>

            <Dialog
                maxWidth="xl"
                open={open}
                onClose={handleClose}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                DownloadIcon
            >
                <img className="bubble" src={image} height={600} width={600}></img>
                <Tooltip title={t('DOWNLOAD')}>
                    <IconButton
                        className="absolute rounded-5 right-0 z-999 flex"
                        style={{
                            alignSelf: 'center',
                            color: '#42A5F5',
                            marginTop: '10px',
                            marginRight: '10px',
                            padding: 0,
                            borderRadius: "5px 5px 5px 5px" 
                            bordeRadius: 5,
                            // borderTopLeftRadius: 5,
                            // borderTopRightRadius: 5,w
                            // borderBottomLeftRadius: 5,
                            // borderBottomRightRadius: 5
                        }}
                        onClick={event => {
                            handleDownload(image, `${imageName}.png`);
                        }}
                    >
                        <DownloadForOfflineOutlinedIcon style={{ width: '50px', height: '50px' }} />
                    </IconButton>
                </Tooltip>
            </Dialog>
        </>
    );
}
export default FacebookChat;
