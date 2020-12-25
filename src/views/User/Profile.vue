<template>
    <div>

        <div class="content">

            <Header title="Profile" backlinkText="Go back" />

            <div class="notification is-danger" v-if="error">{{ error }}</div>
        
            <div v-if="success" class="notification is-success">
                {{ success }}
            </div>

            <form>
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
                
                <!-- <div class="field">
                    <div class="control">
                        <button class="button">Change Password</button>
                    </div>
                </div> -->
                
                <div class="field">
                    <div class="control">
                        <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click.prevent="updateProfile">Update Profile</button>
                    </div>
                </div>
            </form>
            
        </div>
    </div>
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
            console.log('UPDATE')
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