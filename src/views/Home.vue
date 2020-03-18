<template>
    <div class="home">
        <Header title="Welcome to the home screen"/>

        <div class="content">
            
            <router-link v-if="isLoggedIn" class="button" to="/tickets">View Tickets</router-link>
            
        </div>

    </div>
</template>

<script>
import Header from '../components/Header';
import { mapState } from 'vuex';

export default {
    name: 'Home',
    components: {
        Header
    },
    computed: {
        ...mapState(['isLoggedIn']),
    }
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}
</style>