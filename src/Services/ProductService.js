import axios from "axios";


export class ProductService {

    getCategories() {
        return axios.get("http://localhost:8080/api/category/getall");
    }


    getAllProducts() {
        return axios.get("http://localhost:8080/api/products/getall");
    }

    getProducts() {
        return axios.get("http://localhost:8080/api/products/getActiveProduct");
    }

    getProductByID(id) {
        return axios.get("http://localhost:8080/api/products/getById?id=" + id);
    }

    getProductsByCategory(categoryID) {
        return axios.get("http://localhost:8080/api/products/getById?id=" + categoryID);
    }

}
