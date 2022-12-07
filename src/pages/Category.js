import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import DropDown from '../layouts/DropDown'




export default class Category extends React.Component {

    handleSubmit = (event) => {
        let category = this.state;
        console.log(category);
        /*
        let categoryService = new CategoryService()
        categoryService.register(category)
        */
    }
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
                categoryName: '',
                subCategoryName: '',
            }
        }
    }


    render() {
        return (
            <>
                <Form onSubmit={this.handleSubmit}>

                    <Form.Field>
                        <DropDown/>
                    </Form.Field>

                    <Button type='submit' primary onSubmit={this.handleSubmit}>Submit</Button>
                </Form>

            </>

        )
    }

}
