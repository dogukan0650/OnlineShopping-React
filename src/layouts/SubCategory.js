import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { CategoryService } from '../Services/CategoryService';

export default function SubCategory(props) {

    const [SubCategory, setSubCategory] = useState([]);

    useEffect(() => {
        let categoryService = new CategoryService();
        categoryService.getSubcategories(props.categoryName).then(result => setSubCategory(result.data.data))
    })


    return (
        <>
            {SubCategory.map(subcategory => (
                <Dropdown.Menu key={subcategory.subcategoryID}>
                    {subcategory.subcategoryName}
                </Dropdown.Menu>
            ))
            }
        </>
    )
}
