import axios from 'axios';

const url = process.env.VUE_APP_API + '/users';

axios.defaults.withCredentials = true;

class UserService {

    // Create users
    static insertUser(user) {
        const registerUrl = `${url}/register`;
        return axios.post(registerUrl, {
            username: user.username,
            password: user.password,
            email: user.email
        });
    }

    // Confirm a newly registered user
    static confUser(token) {
        const registerUrl = `${url}/login/${token}`;
        return axios.get(registerUrl);
    }

    // Update users
    static updateUser(user) {
        const updateUrl = `${url}/update`;
        return axios.post(updateUrl, user);
    }

    // Forgot password
    static forgotPassword(email) {
        const forgotUrl = `${url}/forgot`;
        return axios.post(forgotUrl, email);
    }

    // Reset password
    static resetUserToken(token) {
        const resetUrl = `${url}/reset/${token}`;
        return axios.get(resetUrl);
    }

    // Reset password with a reset token
    static resetPass(token, pass) {
        const resetUrl = `${url}/reset/${token}`;
        return axios.post(resetUrl, pass);
    }

    // Login a user
    static loginUser(user) {
        const loginUrl = `${url}/login`;
        return axios.post(loginUrl, {
            username: user.username,
            password: user.password
        });
    }

    // Login the demo account
    static loginDevUser() {
        const loginUrl = `${url}/login`;
        return axios.post(loginUrl, {
            username: 'demo',
            password: 'demo123'
        });
    }

    // Return the current authenticated user
    static getCurrentUser() {
        const loginUrl = `${url}/user`;
        return axios.get(loginUrl);
    }

    // Get list of users
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

    // Logout a user
    static logoutUser() {
        const logoutUrl = `${url}/logout`;
        return axios.get(logoutUrl);
    }

    // Delete a user account
    static removeUser(pass) {
        const removeUrl = `${url}/remove`;
        return axios.post(removeUrl, { password: pass });
    }
}

export default UserService;