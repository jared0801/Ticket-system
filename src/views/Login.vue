<template>
    <div class="login">

        <div class="content">
            
            <Header title="Welcome to The Ticket System" />

            <v-form ref="form">
                <v-container>
                    
                    <v-row>
                        <v-col v-if="error" class="red lighten-2 mb-4 ma-1">
                            <span class="white--text">{{error}}</span>
                        </v-col>
                        <v-col v-else-if="success" class="blue lighten-2 mb-4 ma-1">
                            <span class="white--text">{{success}}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="username"
                                :rules="usernameRules"
                                autocomplete="username"
                                label="Username"
                                required
                            >                    
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                label="Password"
                                required
                                autocomplete="current-password"
                                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showPass = !showPass"
                                :type="showPass ? 'text' : 'password'"
                            >                    
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn @click.prevent="checkForm" class="primary">Submit</v-btn>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-7 mb-5" />
                    <v-row>
                        <v-col>
                            First time here? <v-btn text to="/register">Sign Up</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Just taking a look? <v-btn text @click="demoLogin">Demo login</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            Forgot password? <v-btn text to="/forgot">Reset Password</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
            
        </div>

    </div>
</template>

<script>
import UserService from '@/api/UserService';
import Header from '@/components/Header';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Login',
    components: {
        Header
    },
    computed: {
        ...mapState('user', ['isLoggedIn']),
    },
    data() {
        return {
            error: '',
            success: '',
            username: '',
            password: '',
            showPass: false,
            usernameRules: [
                u => !!u || "Username is required.",
                u => (u.length > 3 && u.length < 33) || "Username must be between 4 and 32 characters long."
            ],
            passwordRules: [
                p => !!p || "Password is required.",
                p => (p.length > 5 && p.length < 33) || "Password must be between 6 and 32 characters long."
            ]
        }
    },
    mounted() {
        if(this.isLoggedIn) {
            this.$router.push('/dashboard');
        } else if(this.$route.params.token) {
            UserService.confUser(this.$route.params.token).then(res => {
                if(res.status == 200) {
                    this.success = res.data;
                }
            }).catch(err => {
                this.error = err.response.data.error;
            });
        }
    },
    watch: {
        isLoggedIn: function(val) {
            if(val === true) {
                this.$router.push('/dashboard');
            }
        }
    },
    methods: {
        ...mapMutations('user', ['storeUser']),
        ...mapActions('tickets', ['getAppData']),
        demoLogin() {
            UserService.loginDevUser().then(res => {
                if(res.status === 200) {
                    this.storeUser(res.data);
                    this.getAppData();
                    //this.$router.push('/dashboard');
                }
            })
        },
        checkForm(event) {
            if(!this.$refs.form.validate()) return;

            if(this.username && this.password) {
                UserService.loginUser({
                    username: this.username,
                    password: this.password
                }).then(res => {
                    if(res.status === 200) {
                        this.storeUser(res.data);
                        this.getAppData();
                        //this.$router.push('/dashboard');
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