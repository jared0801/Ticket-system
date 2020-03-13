<template>
    <div class="home">
        <Header title="Welcome to the home screen"/>

        <div class="content">
            
            <router-link class="button" to="/tickets">View Tickets</router-link>
            
        </div>

    </div>
</template>

<script>
import Header from '../components/Header';

export default {
  name: 'home',
  components: {
      Header
  },
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}
</style>