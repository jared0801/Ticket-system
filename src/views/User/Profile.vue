<template>
    <div>
        <Header title="Profile" backlinkText="Go back" />
        
        <p class="error" v-if="error">{{ error }}</p>

        <div class="content">

            <div class="field">
                <label class="label">Username</label>
                <div class="control">
                    <input class="input" type="text" v-model="username" placeholder="Username">
                </div>
            </div>

            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input class="input" type="text" id="create-ticket" v-model="email" placeholder="Email" />
                </div>
            </div>
            
            <div class="field">
                <div class="control">
                    <button class="button">Change Password</button>
                </div>
            </div>
            
            <div class="field">
                <div class="control">
                    <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="updateProfile">Update Profile</button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import { mapGetters } from 'vuex';

export default {
    name: 'Profile',
    data() {
        return {
            username: '',
            email: '',
            error: '',
            loading: false
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
        ...mapGetters(['getUser']),
        updateProfile() {
            /*this.loading = true;
            const ticket = {
                title: this.title,
                text: this.text,
                user: this.getUser().username
            }
            TicketService.insertTicket(ticket).then(() => {
                this.loading = false;
                this.text = '';
                this.title = '';
                this.$router.push('/');
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });*/
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