<template>
    <v-app-bar
        app
        color="primary"
        dark
        >
        <div>
            <v-btn text active-class="active-home" class="button ml-2 mr-2 primary" :to="isLoggedIn ? '/dashboard' : '/'">
                <h1 class="title white--text">Ticketr</h1>
            </v-btn>
        </div>

        <v-spacer></v-spacer>

        <div class="d-none d-sm-flex align-center" v-if="isLoggedIn">
            <p class="mb-0 mr-5">Welcome, {{ username }}</p>
            <v-btn to="/profile" text>Profile</v-btn>
            <v-btn @click="logout" text>Logout</v-btn>
        </div>
        <div class="d-sm-none" v-if="isLoggedIn">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                        Menu
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                    v-for="(item, index) in items"
                    :key="index" @click="item.action"
                    >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-app-bar>
</template>

<script>
import UserService from '../api/UserService';
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
    name: "GlobalHeader",
    data() {
        return {
            items: [
                { title: "Home", action: () => this.$router.push('/') },
                { title: "Profile", action: () => this.$router.push('/profile') },
                { title: "Logout", action: () => this.logout() }
            ]
        }
    },
    computed: {
        ...mapState('user', ['isLoggedIn', 'username']),
        ...mapGetters('user', ['getUser']),
    },
    methods: {
        ...mapMutations('user', ['removeUser']),
        logout() {
            this.removeUser();
            UserService.logoutUser().then((res) => {
                if(res.status == 200) {
                    this.$router.push('/');
                }
            });
        }
    }
}
</script>

<style scoped lang="scss">

// Prevents home button from always being active when at the dashboard
.active-home::before {
    opacity: 0 !important;
}
.active-home:hover:before {
    opacity: 0.18 !important;
}

</style>