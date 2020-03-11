<template>
    <div class="tickets">
        <router-link to="/">Go home</router-link>
        <h1 class="title">Latest Tickets</h1>
        <router-link to="tickets/create">Create a ticket</router-link>
        <hr>
        <TicketList />
    </div>
</template>

<script>
import TicketList from '../components/TicketList';

export default {
    name: 'home',
    components: {
        TicketList
    },
};
</script>
