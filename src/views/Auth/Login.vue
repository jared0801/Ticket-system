<template>
    <div class="home">
        <Header title="Login" backlink="/" backlinkText="Go home" />

        <div class="content">

            <form
                id="loginForm"
                @submit="checkForm"
            >

                <div v-if="error" class="notification is-danger">
                    {{ error }}
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
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['password'] }" type="password" required placeholder="Password" v-model="password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                    <p v-if="errors['password']" class="help is-danger">{{ errors['password'] }}</p>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <input type="submit" value="Submit" class="button is-link" />
                    </div>
                    <div class="control">
                        <a href="/" role="button" class="button is-link is-light">Cancel</a>
                    </div>
                </div>
            </form>
            
        </div>

    </div>
</template>

<script>
import UserService from '@/api/UserService';
import Header from '@/components/Header';
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'Login',
    components: {
        Header
    },
    computed: {
        ...mapState(['isLoggedIn']),
    },
    data() {
        return {
            username: '',
            password: '',
            error: '',
            errors: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        ...mapMutations(['storeUser']),
        clearFields() {
            this.username = '';
            this.password = '';
        },
        checkForm(event) {
            this.error = '';

            if(this.username && this.password) {
                UserService.loginUser({
                    username: this.username,
                    password: this.password
                }).then(res => {
                    if(res.status === 200) {
                        this.$store.commit('storeUser', res.data);
                        this.clearFields();
                        this.$router.push('/');
                    }
                }).catch(err => {
                    if(err.response.status === 401) {
                        this.error = "Username or password is invalid.";
                    } else {
                        this.error = err.error;
                    }
                })
            }
            event.preventDefault();

        }
    }
};
</script>

<style scoped>
</style>