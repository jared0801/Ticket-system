<template>
    <v-container>

        <Header title="Forgot Password" backlinkText="Go Back" />

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
                        v-model="email"
                        label="Email"
                        :rules="emailRules"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-btn
                        class="primary"
                        :disabled="loading"
                        @click.prevent="forgotPassword"
                    >Reset Password</v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script>
import Header from '@/components/Header';
import UserService from '@/api/UserService';
import rulesMixin from '@/mixins/rulesMixin';

export default {
    name: 'Forgot',
    data() {
        return {
            email: '',
            error: '',
            success: '',
            loading: false
        }
    },
    components: {
        Header
    },
    mixins: [ rulesMixin ],
    methods: {
        forgotPassword() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;

            UserService.forgotPassword({ email: this.email }).then((res) => {
                console.log(res);
                if(res.status === 200) {
                    this.success = res.data;
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