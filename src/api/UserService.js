import axios from 'axios';

const url = process.env.VUE_APP_API + '/users';

axios.defaults.withCredentials = true;

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

    // Create users
    static updateUser(user) {
        const updateUrl = `${url}/update`;
        return axios.post(updateUrl, user);
    }

    static loginUser(user) {
        const loginUrl = `${url}/login`;
        return axios.post(loginUrl, {
            username: user.username,
            password: user.password
        });
    }

    static loginDevUser() {
        const loginUrl = `${url}/login`;
        return axios.post(loginUrl, {
            username: 'dev1',
            password: 'dev123'
        });
    }

    static getCurrentUser() {
        const loginUrl = `${url}/user`;
        return axios.get(loginUrl);
    }

    static getUsers() {
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    static logoutUser() {
        const logoutUrl = `${url}/logout`;
        return axios.get(logoutUrl);
    }
}

export default UserService;