<template>
    <v-container>

            
        <Header title="Registration" backlink="/" backlinkText="Go Back" />
    
        <v-row>
            <v-col v-if="error" class="red lighten-2 mb-4 ma-1">
                <span class="white--text">{{error}}</span>
            </v-col>
            <v-col v-else-if="success" class="blue lighten-2 mb-4 ma-1">
                <span class="white--text">{{success}}</span>
            </v-col>
        </v-row>

        <v-form ref="form">

            <v-row>
                <v-col>
                    <v-text-field
                        v-model="username"
                        label="Username"
                        autocomplete="new-username"
                        :rules="usernameRules"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-text-field
                        v-model="email"
                        label="Email"
                        :rules="emailRules"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        label="Password"
                        required
                        autocomplete="new-password" 
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPass = !showPass"
                        :type="showPass ? 'text' : 'password'"
                    >                    
                    </v-text-field>
                </v-col>
            </v-row>

            
            <v-row>
                <v-col>
                    <v-text-field
                        v-model="confPassword"
                        :rules="confPasswordRules"
                        label="Confirm Password"
                        required
                        autocomplete="new-password"
                        :append-icon="showCPass ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showCPass = !showCPass"
                        :type="showCPass ? 'text' : 'password'"
                    >                    
                    </v-text-field>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col>
                    <v-btn @click.prevent="checkForm" class="primary">Submit</v-btn>
                    <v-btn class="ml-5" to="/" text>Cancel</v-btn>
                </v-col>
            </v-row>
        </v-form>
            

    </v-container>
</template>

<script>
import UserService from '@/api/UserService';
import Header from '@/components/Header';
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'Register',
    components: {
        Header
    },
    data() {
        return {
            username: '',
            password: '',
            error: '',
            confPassword: '',
            email: '',
            success: '',
            showPass: false,
            showCPass: false,
            usernameRules: [
                u => !!u || "Username is required.",
                u => (u.length > 3 && u.length < 33) || "Username must be between 4 and 32 characters long."
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                p => !!p || "Password is required.",
                p => (p.length > 5 && p.length < 33) || "Password must be between 6 and 32 characters long."
            ],
            confPasswordRules: [
                p => !!p || "Password confirmation is required.",
                p => p === this.password || "Password confirmation must match your password."
            ]
        }
    },
    computed: {
        ...mapState('user', ['isLoggedIn']),
    },
    mounted() {
        if(this.isLoggedIn) {
            this.$router.push('/projects');
        }
    },
    methods: {
        ...mapMutations('user', ['storeUser']),
        ...mapActions('tickets', ['getAppData']),
        clearFields() {
            this.email = '';
            this.username = '';
            this.password = '';
            this.confPassword = '';
        },
        checkForm() {
            if(!this.$refs.form.validate()) return;
            UserService.insertUser({
                username: this.username,
                password: this.password,
                email: this.email
            }).then(res => {
                if(res.status === 200) {
                    this.success = res.data;
                }
            }).catch(err => {
                if(err.response.status === 409) {
                    if(err.response.data.errors.keyPattern['username']) {
                        this.error = "This username is already in use.";
                    }
                    if(err.response.data.errors.keyPattern['email']) {
                        this.error = "This email is already in use.";
                    }
                }
            })
        }
    }
};
</script>

<style scoped>
#registrationForm {
    margin-bottom: 2em;
}
</style>