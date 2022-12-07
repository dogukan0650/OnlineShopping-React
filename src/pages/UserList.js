import React, { useEffect, useState } from 'react'
import { UserService } from '../Services/UserService'
import { Menu, Table, Icon, Button } from "semantic-ui-react";

export default function UserList() {

    const [Users, setUsers] = useState([])

    useEffect(() => {
        let userService = new UserService();
        userService.getUsers().then(result => setUsers(result.data.data))
    }, [])



    return (
        <div>
            <Table celled className="productTable">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User ID</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Surname</Table.HeaderCell>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Password</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>-</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        Users.map(user => (
                            <Table.Row key={user.userID}>
                                <Table.Cell>{user.userID}</Table.Cell>
                                <Table.Cell>{user.name}</Table.Cell>
                                <Table.Cell>{user.surname}</Table.Cell>
                                <Table.Cell>{user.username}</Table.Cell>
                                <Table.Cell>{user.password}</Table.Cell>
                                <Table.Cell>{user.address}</Table.Cell>
                                <Table.Cell>
                                    <Button color='red' content='Delete' href={'/UserEdit#' + user.userID}/>
                                    <Button color='blue' content='Edit' />
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>

                <Table.Footer >
                    <Table.Row>
                        <Table.HeaderCell colSpan='8'>
                            <Menu floated='right' pagination >
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron left' />
                                </Menu.Item>
                                <Menu.Item as='a'>1</Menu.Item>
                                <Menu.Item as='a'>2</Menu.Item>
                                <Menu.Item as='a'>3</Menu.Item>
                                <Menu.Item as='a'>4</Menu.Item>
                                <Menu.Item as='a' icon>
                                    <Icon name='chevron right' />
                                </Menu.Item>
                            </Menu>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    )
}
