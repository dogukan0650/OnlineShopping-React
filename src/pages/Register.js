import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { UserService } from '../Services/UserService'

export default class Register extends React.Component {

  handleSubmit = (event) => {
    let user = this.state;
    console.log(user);
    let userService = new UserService();
    userService.register(user);
  }

  handleInputChange(e) {
    let formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({ formData });
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      formData: {
        name: '',
        surname: '',
        username: '',
        password: '',
        address: '',
        role: 'Seller'
      }
    };

  }

  handleAccountType(e) {
    let a = (e.target.value);
    console.log(a);
  }

  render() {

    return (

      <Form onSubmit={this.handleSubmit}>
        <table className='center'>
          <tbody >
            <tr>
              <td className='allignLeft'>
                <label >Account Type: </label>
              </td>
              <td>
                <Form.Field inline name='role'>
                  <select name='role' onChange={this.handleAccountType} required defaultValue='seller'>
                    <option value="Seller" >Seller</option>
                    <option value="Customer">Customer</option>
                  </select>
                </Form.Field>
              </td>
            </tr>
            <tr>
              <td className='allignLeft'>
                <label>Name: </label>
              </td>
              <td>
                <Form.Field inline>
                  <input type='text' placeholder='Name' name="name" required onChange={this.handleInputChange} />
                </Form.Field>
              </td>
            </tr>

            <tr>
              <td className='allignLeft'>
                <label>Surname: </label>
              </td>
              <td>
                <Form.Field inline name="surname" >
                  <input type='text' placeholder='Surname' name='surname' required onChange={this.handleInputChange} />
                </Form.Field>
              </td>
            </tr>

            <tr>
              <td className='allignLeft'>
                <label>Username: </label>
              </td>
              <td>
                <Form.Field inline name="username" >
                  <input type='text' placeholder='Username' name='username' required onChange={this.handleInputChange} />
                </Form.Field>
              </td>
            </tr>

            <tr>
              <td className='allignLeft'>
                <label>Password: </label>
              </td>
              <td>
                <Form.Field inline name="password" >
                  <input type='password' placeholder='Password' name='password' required onChange={this.handleInputChange} />
                </Form.Field>
              </td>
            </tr>

            <tr>
              <td className='allignLeft'>
                <label>Address: </label>
              </td>
              <td>
                <Form.Field inline name="address"  >
                  <input type='text' placeholder='Address' name='address' required onChange={this.handleInputChange} />
                </Form.Field>
              </td>
            </tr>
          </tbody>
        </table>
        <Button color='green' type='submit'>Register </Button>
      </Form>
    )

  }
}
