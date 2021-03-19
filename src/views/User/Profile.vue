<template>
    <v-container>

        <PageHeader title="Profile" backlinkText="Go Back" />

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
                        :rules="usernameRules"
                        :disabled="getUser().username == 'demo'"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <p>{{ email }}</p>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn
                        class="primary"
                        :loading="loading"
                        @click.prevent="updateProfile"
                        :disabled="getUser().username == 'demo'"
                    >Update Profile</v-btn>
                    

                    <v-dialog
                        v-model="confirmDelete"
                        width="500"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="red lighten-2"
                            class="ml-3"
                            dark
                            :disabled="getUser().username == 'demo'"
                            v-bind="attrs"
                            v-on="on"
                            :loading="loading"
                        >
                            Delete Profile
                        </v-btn>
                        </template>
                
                        <v-card>
                        <v-card-title class="headline grey lighten-2">
                            Delete Your Account?
                        </v-card-title>
                
                        <v-card-text class="mt-2">
                            Type in your password below if you are sure you would like to delete your account and all projects that you lead. This action cannot be undone.
                        </v-card-text>

                        <v-form ref="passForm">
                            <v-container>
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
                            </v-container>
                        </v-form>
                
                        <v-divider></v-divider>
                
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red lighten-2"
                                dark
                                @click="deleteProfile"
                            >
                            Delete Profile
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import UserService from '@/api/UserService';
import rulesMixin from '@/mixins/rulesMixin';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Profile',
    data() {
        return {
            username: '',
            email: '',
            error: '',
            confirmDelete: false,
            success: '',
            loading: false,
            showPass: false,
            password: ''
        }
    },
    mixins: [ rulesMixin ],
    components: {
        PageHeader
    },
    created() {
        this.username = this.getUser().username;
        this.email = this.getUser().email;
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        ...mapMutations('user', ['updateUser', 'removeUser']),
        updateProfile() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;
            if(this.username === this.getUser().username) {
                // No changes were made
                this.loading = false;
                return;
            }
            const newProfile = {
                username: this.username
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
            });
        },
        deleteProfile() {
            if(!this.$refs.passForm.validate()) return;
            UserService.removeUser(this.password).then(res => {
                this.removeUser();
                this.confirmDelete = false;
                if(res.status === 200) {
                    UserService.logoutUser().then((res) => {
                        if(res.status == 200) {
                            this.$router.push('/');
                        }
                    });
                } else {
                    this.err = res.data;
                }
            }).catch((err) => {
                console.log(err.response);
                if(err.response.status) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "There was an error deleting your account. Please try again later."
                }
                this.confirmDelete = false;
            })
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