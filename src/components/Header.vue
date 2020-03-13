<template>
    <header class="header">
        <h1 class="title">{{ title }}</h1>

        <router-link v-if="backlink" class="button" :to="backlink">
            <i class="fas fa-arrow-left"></i>
            <span style="padding-left: 10px">{{ backlinkText }}</span>
        </router-link>

        
        <router-link class="button" to="/login">Login</router-link>
        <router-link class="button" to="/register">Register</router-link>
        <hr>
    </header>    
</template>

<script>
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
        backlinkText: {
            type: String
        }
    }
}
</script>

<style scoped>
.header {
    padding-top: 60px;
    text-align: center;
}

</style>