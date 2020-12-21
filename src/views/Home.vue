<template>
    <div class="home">

        <div class="content">
            
            <Header title="Welcome to The Ticket System" />

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
                        <input class="input" :class="{ 'is-danger' : errors['username'] }" type="text" required autocomplete="username" placeholder="Username" v-model="username">
                        <span class="icon is-small is-left">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                    <p v-if="errors['username']" class="help is-danger">{{ errors['username'] }}</p>
                </div>
                
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control has-icons-left has-icons-right">
                        <input class="input" :class="{ 'is-danger' : errors['password'] }" type="password" required autocomplete="current-password" placeholder="Password" v-model="password">
                        <span class="icon is-small is-left">
                            <i class="fas fa-key"></i>
                        </span>
                    </div>
                    <p v-if="errors['password']" class="help is-danger">{{ errors['password'] }}</p>
                </div>

                <div class="field is-grouped">
                    <div class="control">
                        <input type="submit" value="Sign In" class="button is-link" />
                    </div>
                </div>
                
                <div>
                    First time here? <router-link to="/register">Sign Up</router-link>
                </div>
                <div>
                    Just taking a look? <router-link to="/">Demo login</router-link>
                </div>
            </form>
            
        </div>

    </div>
</template>

<script>
import UserService from '@/api/UserService';
import Header from '@/components/Header';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Home',
    components: {
        Header
    },
    computed: {
        ...mapState('user', ['isLoggedIn']),
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
    created() {
        if(this.isLoggedIn) {
            this.$router.push('/projects');
        }
    },
    methods: {
        ...mapMutations('user', ['storeUser']),
        ...mapActions('tickets', ['getAppData']),
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
                        this.storeUser(res.data);
                        this.getAppData();
                        this.clearFields();
                        this.$router.push('/projects');
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