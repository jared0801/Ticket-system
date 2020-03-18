import axios from 'axios';

const url = process.env.VUE_APP_API + '/users';

class UserService {
    // Get a single user
    /*static getUser(id) {
        return new Promise((resolve, reject) => {
            axios.get(url + `/${id}`).then((res) => {
                const user = res.data;
                resolve({
                    ...user,
                    createdAt: new Date(user.createdAt)
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }*/

    // Create users
    static insertUser(user) {
        const registerUrl = `${url}/register`;
        return axios.post(registerUrl, {
            username: user.username,
            password: user.password,
            email: user.email
        });
    }

    static loginUser(user) {
        const loginUrl = `${url}/login`;
        return axios.post(loginUrl, {
            username: user.username,
            password: user.password
        });
    }

    static getUser() {
        const loginUrl = `${url}/user`;
        return axios.get(loginUrl);
    }

    static logoutUser() {
        const logoutUrl = `${url}/logout`;
        axios.get(logoutUrl).then(res => {
            window.location.href = res.request.responseURL;
        })
        
    }
}

export default UserService;