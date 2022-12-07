import React, { useState, useEffect } from 'react'
import { CategoryService } from '../Services/CategoryService'


export default function DropDown() {

    const [Category, setCategory] = useState([]);
    const [Subcategory, setSubcategory] = useState([]);

    useEffect(() => {
        let categoryService = new CategoryService();
        categoryService.getAllCategories().then(result => {
            if (result && result.data) {
                setCategory(result.data.data);
            }
        });
        console.log("useEffect");


    }, []);

    function subCategoryUpdate(event) {
        let categoryService = new CategoryService();
        categoryService.getSubcategories(event.target.value).then(function (result) {
            console.log(result);
            if (result && result.data) {
                setSubcategory(result.data.data);
                console.log(result.data.data);

            }
        });
    }


    return (
        <>
            <div className="flex-container-horizontal" >
                <label>Category Name: </label>
                <select name='categoryName' onChange={subCategoryUpdate} style = {{marginLeft: 'auto'}}>
                    {
                        Category.map(cat => (
                            <option key={cat.categoryID} name={cat.categoryName} value={cat.categoryName} >{cat.categoryName}</option>
                        ))
                    }
                </select>
            </div>

            <div className="flex-container-horizontal">

                <label>Subcategory Name: </label>
                <select name='subcategory' >
                    {
                        Subcategory.map(subcategory => (
                            <option key={subcategory.subCategoryID}>{subcategory.subCategoryName}</option>
                        ))
                    }
                </select>
            </div>
        </>
    )
}
