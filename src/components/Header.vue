<template>
    <header class="header">
        <h1 class="title">{{ title }}</h1>

        <div class="header-menu">

            <router-link v-if="backlink" class="button back-button" :to="backlink">
                <i class="fas fa-arrow-left"></i>
                <span style="padding-left: 10px">{{ backlinkText }}</span>
            </router-link>

            <a v-else-if="backlinkText" role="button" class="button back-button" @click="$router.go(-1)">
                <i class="fas fa-arrow-left"></i>
                <span style="padding-left: 10px">{{ backlinkText }}</span>
            </a>

            <span class="button-group" :class="{ 'is-centered' : !backlink && !backlinkText }" v-if="isLoggedIn">
                <p>Welcome back, {{ username }}</p>
                <router-link class="button" to="/profile">Profile</router-link>
                <button @click="logout" class="button" href="/logout">Logout</button>
            </span>
            <span class="button-group" :class="{ 'is-centered' : !backlink && !backlinkText }" v-else>
                <router-link class="button" to="/login">Login</router-link>
                <router-link class="button" to="/register">Register</router-link>
            </span>

        </div>
        <hr>
    </header>    
</template>

<script>
import UserService from '../api/UserService';
import { mapState, mapMutations } from 'vuex';

export default {
    name: "TicketHeader",
    props: {
        title: {
            type: String,
            required: true
        },
        backlink: {
            type: String
        },
        // If backlinkText is provided but backlink is not, backlink will default to the last vue-router route
        backlinkText: {
            type: String
        }
    },
    computed: {
        ...mapState(['isLoggedIn', 'username']),
    },
    methods: {
        ...mapMutations(['removeUser']),
        logout() {
            this.removeUser();
            UserService.logoutUser().then(() => {
                this.$router.push('/');
            })
        }
    }
}
</script>

<style scoped>
.header {
    padding-top: 1.5em;
    text-align: center;
}

.header-menu {
    display: flex;
    justify-content: space-between;
}

.back-button {
    margin-left: 10%;
}

.button-group {
    margin-right: 10%;
    display: flex;
    align-items: center;
}

.button-group .button {
    margin: 0 5px;
}

.is-centered {
    margin: auto;
}
</style>