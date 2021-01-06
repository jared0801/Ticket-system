<template>
    <v-container>

            <Header title="Profile" backlinkText="Go back" />

            <v-row>
                <v-col v-if="error" class="red lighten-2 mb-4 ma-1">
                    <span class="white--text">{{error}}</span>
                </v-col>
                <v-col v-else-if="success" class="blue lighten-2 mb-4 ma-1">
                    <span class="white--text">{{success}}</span>
                </v-col>
            </v-row>

            <v-form>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="username"
                            label="Username"
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
                
                <!-- <v-row>
                    <v-col>
                        <v-btn
                            @click="changePassword"
                        >Change Password</v-btn>
                    </v-col>
                </v-row> -->

                <v-row>
                    <v-col>
                        <v-btn
                            class="primary"
                            :class="{ 'is-loading' : loading }"
                            @click.prevent="updateProfile"
                        >Update Profile</v-btn>
                    </v-col>
                </v-row>
            </v-form>
    </v-container>
</template>

<script>
import Header from '@/components/Header';
import UserService from '@/api/UserService';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Profile',
    data() {
        return {
            username: '',
            email: '',
            error: '',
            success: '',
            loading: false,
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
            ]
        }
    },
    components: {
        Header
    },
    created() {
        this.username = this.getUser().username;
        this.email = this.getUser().email;
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        ...mapMutations('user', ['updateUser']),
        updateProfile() {
            this.loading = true;
            if(!this.email || !this.username) {
                this.error = "A username and email are required at all times.";
                return;
            }
            if(this.email === this.getUser().email && this.username === this.getUser().username) {
                // No changes were made
                this.loading = false;
                return;
            }
            const newProfile = {
                username: this.username,
                email: this.email
            }
            UserService.updateUser(newProfile).then((res) => {
                console.log(res);
                if(res.status === 200) {
                    this.updateUser(res.data);
                    this.success = "Your profile was succesfully updated.";
                }
                this.loading = false;
                this.error = '';
            }).catch((err) => {
                this.loading = false;
                console.log(err);
                if(err.response.data.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = err;
                }
                this.username = this.getUser().username;
                this.email = this.getUser().email;
            });
        }
    }
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}

.input {
    margin-bottom: 10px;
}

.textarea {
    margin-bottom: 10px;
}
</style>