<template>
    <v-container>

        <PageHeader title="Forgot Password" backlinkText="Go Back" />

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
                    <v-btn
                        class="primary"
                        :class="{ 'is-loading' : loading }"
                        @click.prevent="resetPassword"
                    >Reset Password</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import UserService from '@/api/UserService';
import rulesMixin from '@/mixins/rulesMixin';

export default {
    name: 'Reset',
    data() {
        return {
            password: '',
            confPassword: '',
            error: '',
            success: '',
            loading: false,
            showPass: false,
            showCPass: false
        }
    },
    components: {
        PageHeader
    },
    mixins: [ rulesMixin ],
    mounted() {
        UserService.resetUserToken(this.$route.params.token).then((res) => {
            console.log(res);
            if(res.status === 200) {
                this.success = `User found`;
            }
            this.loading = false;
            this.error = '';
        }).catch((err) => {
            this.loading = false;
            console.log(err.response);
            if(err.response.status == 400) {
                this.$router.push('/');
            }
        });
    },
    methods: {
        resetPassword() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;

            const pass = {
                password: this.password,
                confPassword: this.confPassword
            }
            UserService.resetPass(this.$route.params.token, pass).then((res) => {
                console.log(res);
                if(res.status === 200) {
                    this.success = `Password successfully reset.`;
                }
                this.loading = false;
                this.error = '';
            }).catch((err) => {
                this.loading = false;
                console.log(err.response);
                if(err.response.data.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = err;
                }
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