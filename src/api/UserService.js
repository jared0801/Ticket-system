import axios from 'axios';

const url = process.env.VUE_APP_API + '/users';

class UserService {
    // Get a single user
    static getUser(id) {
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
    }

    // Create users
    static insertUser(user) {
        return axios.post(url, {
            username: user.username,
            password: user.password,
            email: user.email
        });
    }
}

export default UserService;