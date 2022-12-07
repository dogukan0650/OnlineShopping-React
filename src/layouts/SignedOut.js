import React from 'react'
import { Button } from 'semantic-ui-react'

export default function SignedOut(props) {
    return (
        <div>
            <Button onClick={props.signIn}>Login</Button>
            <Button primary size='tiny' href='./Register' >Register</Button>
        </div>
    )
}
