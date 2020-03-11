<template>
    <div class="container">
        <p class="error" v-if="error">{{ error }}</p>

        <div v-if="loading">Loading...</div>

        <div class="ticket-container">
            <div class="ticket" v-for="(ticket, index) in tickets" v-bind:key="ticket._id">
                {{ `${index} - ${ticket.createdAt.getMonth()+1}/${ticket.createdAt.getDate()}/${ticket.createdAt.getFullYear()}` }}
                <p class="text">{{ ticket.text }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import TicketService from '../api/TicketService';

export default {
    name: "TicketList",
    data() {
        return {
            tickets: [],
            error: '',
            loading: false
        }
    },
    async created() {
        this.loading = true;
        try {
            this.tickets = await TicketService.getTickets();
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    }
    
}
</script>

<style scoped>

</style>