import React, { useState } from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import SignedIn from './SignedIn';



export default function Navi() {

    const [isAuthenticated, setisAuthenticated] = useState()

    function handleSignOut(params) {
        setisAuthenticated(false)
    }

    return (

        <div >
            <Menu style={{ backgroundColor: '#226365' }} position='fixed'>

                <Container>
                    <Menu.Item>
                        <a href='/'>Home</a>
                    </Menu.Item>

                    <Menu.Menu>
                        <Menu.Item>
                            <Button primary href="/UserList">Users</Button>
                            <Button primary href="/Category">Add Category</Button>
                            <Button primary href="/ProductAdd">Add Product</Button>
                        </Menu.Item>
                    </Menu.Menu>

                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button primary href="/CartSummary">Cart <label>( )</label> </Button>

                        </Menu.Item>

                        {isAuthenticated ?
                            <Menu.Item >
                                <SignedIn signOut={handleSignOut} />
                            </Menu.Item>
                            :
                            <Menu.Item >
                                <Button href="/Login">Login</Button>
                            </Menu.Item>
                        }

                    </Menu.Menu>
                </Container>
            </Menu>
        </div>
    )
}
