<template>
    <v-app-bar
        app
        color="primary"
        dark
        >
      <div>
        <v-btn text class="button home-button ml-2 mr-2 primary" :to="isLoggedIn ? '/dashboard' : '/'">
            <h1 class="title white--text">Ticket System</h1>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

        <p class="mb-0 mr-5">Welcome back, {{ username }}</p>
        <div class="d-flex align-center" v-if="isLoggedIn">
            <v-btn to="/profile" text>Profile</v-btn>
            <v-btn @click="logout" text href="/logout">Logout</v-btn>
        </div>
    </v-app-bar>
    <!--
    <header class="header">

        <router-link class="button home-button" :to="isLoggedIn ? '/dashboard' : '/'">
            <div class="icon-wrapper">
                <i class="fas fa-trademark fa-2x"></i>
            </div>
        </router-link>

        <span class="button-group" v-if="isLoggedIn">
            <p class="welcome-user">Welcome back, {{ username }}</p>
            <router-link class="button" to="/profile">Profile</router-link>
            <button @click="logout" class="button" href="/logout">Logout</button>
        </span>

    </header>
    -->
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
        ...mapMutations('user', ['removeUser', 'storeUser']),
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
    created() {
        UserService.getCurrentUser().then(async (res) => {
            if(res.data && 'username' in res.data) {
                const user = res.data;
                this.storeUser(user);
                await this.getAppData();
            }
        }).catch(() => {
            // User not logged in
        });
    }
}
</script>

<style scoped>
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
</style>