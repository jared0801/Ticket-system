<template>
    <div class="home">
        <div class="content">

            <h1 class="welcome">Welcome to my Ticket System</h1>
            
            <router-link v-if="isLoggedIn" class="button" to="/projects">Get Started</router-link>
            <div v-else>
                <p><router-link to="/login">Login</router-link> or <router-link to="/register">register</router-link> to get started!</p>
                <p><a @click="devUser">Try it out</a> - Tour the app without the ability to create projects, tickets, or comments.</p>
            </div>
            
        </div>

    </div>
</template>

<script>
import UserService from '@/api/UserService';
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'Home',
    components: {
    },
    computed: {
        ...mapState(['isLoggedIn']),
    },
    methods: {
        ...mapMutations(['storeUser']),
        devUser() {
            UserService.loginDevUser().then(res => {
                if(res.status === 200) {
                    this.storeUser(res.data);
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
    }
};
</script>

<style scoped>

.welcome {
    margin: 1em 0 2em;
}

.content {
    text-align: center;
    padding-bottom: 3em;
}

.button {
    padding: 2em;
}

</style>