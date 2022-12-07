import axios from 'axios'

export class UserService {


    Login({data}) {
        return axios.post("http://localhost:8080/login", { ...data }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });

    }

    getAllUsers() {
        return axios.get("http://localhost:8080/api/users/getall");
    }

    getUsers() {
        return axios.get("http://localhost:8080/api/users/getActiveUsers");
    }


    register({ formData }) {

        if (formData.accountType === 'Customer') {
            return axios.post("http://localhost:8080/api/users/create", { ...formData }).then(function (response) {
                console.log(response);
            })
                .catch(function (error) {
                    console.log(error);
                });
        }

        return axios.post("http://localhost:8080/api/users/create", { ...formData }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            });
    }

}
