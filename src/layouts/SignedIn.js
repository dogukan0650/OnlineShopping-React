import React from 'react'
import { Dropdown } from 'semantic-ui-react'

export default function SignedIn(props) {
    return (
        <div>
            <Dropdown item text='name'>
                <Dropdown.Menu>
                    <Dropdown.Item>Details</Dropdown.Item>
                    <Dropdown.Item onClick={props.signOut} >Sign Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}
