<template>
    <div class="home">
        <Header title="Registration" backlink="/" backlinkText="Go home" />

        <div class="content">

            <form
                id="registrationForm"
                @submit="checkForm"
            >

                <div v-if="success" class="notification is-success">
                    {{ success }}
                </div>


                <div class="field">
                    <label class="label">Username</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['username'] }" type="text" required placeholder="Username" v-model="username">
                        <span class="icon is-small is-left">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                    <p v-if="errors['username']" class="help is-danger">{{ errors['username'] }}</p>
                </div>

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['email'] }" type="email" required placeholder="Email" v-model="email">
                        <span class="icon is-small is-left">
                            <i class="fas fa-envelope"></i>
                        </span>
                    </div>
                    <p v-if="errors['email']" class="help is-danger">{{ errors['email'] }}</p>
                </div>
                
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['password'] }" type="password" required placeholder="Password" v-model="password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                    <p v-if="errors['password']" class="help is-danger">{{ errors['password'] }}</p>
                </div>
                
                <div class="field">
                    <label class="label">Confirm Password</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['confPassword'] }" type="password" required placeholder="Confirm Password" v-model="confPassword">
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                    <p v-if="errors['confPassword']" class="help is-danger">{{ errors['confPassword'] }}</p>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <input type="submit" value="Submit" class="button is-link" />
                    </div>
                    <div class="control">
                        <button class="button is-link is-light">Cancel</button>
                    </div>
                </div>
            </form>
            
        </div>

    </div>
</template>

<script>
import UserService from '../api/UserService';
import Header from '../components/Header';

export default {
    name: 'home',
    components: {
        Header
    },
    data() {
        return {
            username: '',
            password: '',
            confPassword: '',
            email: '',
            success: '',
            errors: {
                username: '',
                password: '',
                confPassword: '',
                email: ''
            }
        }
    },
    methods: {
        clearErrors() {
            this.errors.username = '';
            this.errors.email = '';
            this.errors.password = '';
            this.errors.confPassword = '';
        },
        clearFields() {
            this.email = '';
            this.username = '';
            this.password = '';
            this.confPassword = '';
        },
        checkForm(event) {
            this.clearErrors();
            if(this.username && this.password && this.confPassword && this.email) {
                if(this.password.length < 6 || this.password.length > 32) {
                    this.errors['password'] = "Password length must be between 6 and 32 characters long.";
                }

                if(this.password !== this.confPassword) {
                    this.errors['confPassword'] = "Passwords must match."
                }

                if(this.username.length < 4 || this.username.length > 32) {
                    this.errors['username'] = "Username length must be between 4 and 32 characters long."
                }

            }

            if(! (this.errors['password'] || this.errors['confPassword'] || this.errors['email'] || this.errors['username'])) {
                UserService.insertUser({
                    username: this.username,
                    password: this.password,
                    email: this.email
                }).then(res => {
                    if(res.status === 201) {
                        console.log(res.status);
                        this.clearFields();
                        this.success = "Your account was succesfully created!";
                    }
                }).catch(err => {
                    if(err.response.status === 409) {
                        if(err.response.data.errors.keyPattern['username']) {
                            this.errors['username'] = "This username is already in use.";
                        }
                        if(err.response.data.errors.keyPattern['email']) {
                            this.errors['email'] = "This email is already in use.";
                        }
                    }
                })
            }
            event.preventDefault();

        }
    }
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}
</style>