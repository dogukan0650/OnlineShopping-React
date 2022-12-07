import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import { UserService } from '../Services/UserService';

export default class Login extends React.Component {

  handleInputChange(e) {
    let formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({ formData })
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      formData: {
        username: '',
        password: ''
      }
    }
  }

  sendLoginRequest = (e) =>{
    let data = this.state;
    console.log(data);

     let userService = new UserService();
     userService.Login(data);
  }

  

  render(){
    return(
      <div>
    <Form onSubmit={this.sendLoginRequest}>
      <table className='center'>
        <tbody>
  
          <tr>
            <td>
              <label >Username : </label>
            </td>
            <td>
              <Form.Field inline>
                <input type='text' placeholder='Username' name='username' onChange={this.handleInputChange} />
              </Form.Field>
            </td>
          </tr>
  
          <tr>
            <td>
              <label>Password : </label>
            </td>
            <td>
              <Form.Field inline>
                <input type='password' placeholder='Password' name='password' onChange={this.handleInputChange} />
              </Form.Field>
            </td>
          </tr>
        </tbody>
      </table>
      <Button type='submit'> Login</Button>
      <Button href="/Register"> Register</Button>
    </Form>
      </div >
    )
  }
  }
  
