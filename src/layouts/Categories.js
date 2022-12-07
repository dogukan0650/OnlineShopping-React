import React, { useEffect, useState } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { CategoryService } from '../Services/CategoryService';

export default function Categories() {

    /*
     Anasayfa üzerindeki kategori kısmı
     */


    const [Categories, setCategories] = useState([]);
    const [Subcategories, setSubcategories] = useState([]);

    /* kategori getirmece */
    useEffect(() => {
        let categoryService = new CategoryService();
        categoryService.getAllCategories().then(result => setCategories(result.data.data));
    }, []);

    /* alt kategori getirmece */
    useEffect(() => {

        let categoryService = new CategoryService();
        let array = [];
        Categories.map((category) => {
            let counter = 0;
            categoryService.getSubcategories(category.categoryName)
                .then(result => {
                    let a = result.data.data;

                    if (a.length > 0) {
                        if (a.length === 1) {
                            array.push({ subCategoryID: a[counter].subCategoryID, subCategoryName: a[counter].subCategoryName, categoryID: category.categoryID });
                        }
                        else if (a.length > 1) {

                            a.forEach(element => {
                                array.push({ subCategoryID: element.subCategoryID, subCategoryName: element.subCategoryName, categoryID: category.categoryID });
                            });
                        }


                    }
                    setSubcategories(array);
                });

        });
    }, [Categories]);

    function selectionHandler(event) {
        console.log(event);
    }



    return (
        <div>
            <Menu pointing secondary vertical color='red'>
                <div className='flex-container-vertical'>
                    {Categories.map(category => (
                        <Dropdown pointing className='link item' key={category.categoryID} text={category.categoryName} /*onChange={<SubCategory categoryName={category.categoryName} />}  */>

                            <Dropdown.Menu key={category.categoryID}>

                                {
                                    Subcategories.map(subcategory => {
                                        if (subcategory.categoryID === category.categoryID) {
                                            return (<Dropdown.Item onClick={() => selectionHandler(subcategory.subCategoryID)} key={subcategory.subCategoryID}  > - {subcategory.subCategoryName} - </Dropdown.Item>)
                                        }
                                    })

                                }

                            </Dropdown.Menu>


                        </Dropdown>
                    ))
                    }
                </div>
            </Menu>
        </div>
    )
}
