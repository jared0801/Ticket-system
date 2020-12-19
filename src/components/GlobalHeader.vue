<template>
    <header class="header">

        <router-link class="button home-button" to="/">
            <div class="icon-wrapper">
                <i class="fas fa-trademark fa-2x"></i>
            </div>
        </router-link>

        <span class="button-group" v-if="isLoggedIn">
            <p class="welcome-user">Welcome back, {{ username }}</p>
            <router-link class="button" to="/profile">Profile</router-link>
            <button @click="logout" class="button" href="/logout">Logout</button>
        </span>
        <span class="button-group" v-else>
            <router-link class="button" to="/login">Login</router-link>
            <router-link class="button" to="/register">Register</router-link>
        </span>

    </header>    
</template>

<script>
import UserService from '../api/UserService';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

export default {
    name: "GlobalHeader",
    props: {
    },
    computed: {
        ...mapState('user', ['isLoggedIn', 'username']),
        ...mapGetters('user', ['getUser']),
    },
    methods: {
        ...mapMutations('user', ['removeUser']),
        ...mapMutations('user', ['storeUser']),
        ...mapActions('tickets', ['getAppData']),
        logout() {
            this.removeUser();
            UserService.logoutUser().then((res) => {
                if(res.status == 200) {
                    this.$router.push('/');
                }
            });
        }
    },
    async created() {
        const response = await UserService.getCurrentUser();
        if(response.data && 'username' in response.data) {
            const user = response.data;
            this.storeUser(user);
            await this.getAppData();
        }
    }
}
</script>

<style scoped>
.home-button {
    margin-left: 10%;
    background: #003459;
}
.icon-wrapper {
    overflow: hidden;
    width: 18px;
    color: white;
}

.header {
    background: #00171F;
    color: white;
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
}

.button-group {
    margin-right: 10%;
    display: flex;
    align-items: center;
}

.button-group .button {
    margin: 0 5px;
}

.welcome-user {
    padding-right: 1em;
}
</style>