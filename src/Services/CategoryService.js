import axios from 'axios'

export class CategoryService {

    getAllCategories() {
        return axios.get("http://localhost:8080/api/category/getall");
    }

    addCategory({ category }) {
        return axios.get("http://localhost:8080/api/category/add", { ...category }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    getSubcategories(categoryName) {
        return axios.get("http://localhost:8080/api/category/getSubCategoryByCategoryName?categoryName=" + categoryName.toString());
    }

    // getCategories(){
    //     return axios.get("http://localhost:8080/api/category/findDistinctByCategoryName");
    // }
}
