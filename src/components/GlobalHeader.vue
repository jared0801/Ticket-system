<template>
    <v-app-bar
        app
        color="primary"
        dark
        >
      <div>
        <v-btn text active-class="active-home" class="button ml-2 mr-2 primary" :to="isLoggedIn ? '/dashboard' : '/'">
            <h1 class="title white--text">Ticket System</h1>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

        <div class="d-flex align-center" v-if="isLoggedIn">
            <p class="mb-0 mr-5">Welcome back, {{ username }}</p>
            <v-btn to="/profile" text>Profile</v-btn>
            <v-btn @click="logout" text>Logout</v-btn>
        </div>
    </v-app-bar>
</template>

<script>
import UserService from '../api/UserService';
import { mapState, mapMutations, mapGetters } from 'vuex';

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
            }
        });
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