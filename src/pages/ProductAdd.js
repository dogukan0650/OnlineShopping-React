import React from 'react'
import { Button, Form, TextArea } from 'semantic-ui-react'
import DropDown from '../layouts/DropDown'

export default class ProductAdd extends React.Component {

    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            formData: {}
        }

    }

    handleSubmit = (event) => {
        let user = this.state;
        console.log(user);
    }

    handleInputChange(e) {
        let formData = Object.assign({}, this.state.formData);
        formData[e.target.name] = e.target.value;
        this.setState({ formData })
    }
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <table className='center'>
                    <tbody >
                        <tr>
                            <Form.Field inline >
                                <DropDown onChange={this.handleInputChange} />
                            </Form.Field>
                        </tr>



                        { /*<tr>
                            <td className='allignLeft'>
                                <label >Category of Product: </label>
                            </td>
                            <td>
                                <Form.Field inline name='productType'>
                                    <select name='productType' onChange={this.handleInputChange} required defaultValue='seller'>
                                        <option value="Electronic" >Electronic</option>
                                        <option value="Food">Food</option>
                                    </select>
                                </Form.Field>
                            </td>
                        </tr>
                        <tr>
                            <td className='allignLeft'>
                                <label >Subcategory of Product: </label>
                            </td>
                            <td>
                                <Form.Field inline name='productSubtype'>
                                    <select name='productSubtype' onChange={this.handleInputChange} required defaultValue='seller'>
                                        <option value="Electronic" >Electronic</option>
                                        <option value="Food">Food</option>
                                    </select>
                                </Form.Field>
                            </td>
        </tr>*/}

                        <tr>
                            <td className='allignLeft'>
                                <label>Product Name: </label>
                            </td>
                            <td>
                                <Form.Field inline>
                                    <input type='text' placeholder='Product Name' name="productName" required onChange={this.handleInputChange} />
                                </Form.Field>
                            </td>
                        </tr>

                        <tr>
                            <td className='allignLeft'>
                                <label>Product Stock: </label>
                            </td>
                            <td>
                                <Form.Field inline name="unitStock" >
                                    <input type='number' placeholder='Product Stock' name='unitStock' required onChange={this.handleInputChange} />
                                </Form.Field>
                            </td>
                        </tr>

                        <tr>
                            <td className='allignLeft'>
                                <label>Product Price: </label>
                            </td>
                            <td>
                                <Form.Field inline name="price" >
                                    <input min="0.00"
                                        step="0.01"
                                        max="99999.00" type='number' placeholder='Product Price' name='price' required onChange={this.handleInputChange} />
                                </Form.Field>
                            </td>
                        </tr>

                        <tr>
                            <td className='allignLeft'>
                                <label>Company Name: </label>
                            </td>
                            <td>
                                <Form.Field inline name="companyName" >
                                    <input type='text' placeholder='Company Name' name='companyName' required onChange={this.handleInputChange} />
                                </Form.Field>
                            </td>
                        </tr>

                        <tr>
                            <td className='allignLeft'>
                                <label>Description: </label>
                            </td>
                            <td>
                                <Form.Field inline name="description"  >
                                    <TextArea style={{ minHeight: 50 }} type='text' placeholder='Description' name='description' required onChange={this.handleInputChange} />
                                </Form.Field>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button color='green' type='submit'>Add </Button>
            </Form>
        )
    }

}
