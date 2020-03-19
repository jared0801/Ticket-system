<template>
    <div class="tickets">
        <!-- <router-link to="/">Go home</router-link>
        <h1 class="title">Latest Tickets</h1>
        <hr> -->
        <Header title="Latest Tickets" backlinkText="Back" />

        <div class="content">
            <router-link class="button" :to="{ name: 'create-ticket' }">Create a ticket</router-link>
            <TicketList />
        </div>
        
    </div>
</template>

<script>
import TicketList from '@/components/TicketList';
import Header from '@/components/Header';

export default {
    name: 'Tickets',
    components: {
        TicketList,
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