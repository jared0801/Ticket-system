<template>
    <div class="container">
        <p class="error" v-if="error">{{ error }}</p>

        <div class="ticket-container">
            <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Ticket Title</th>
                        <th>Ticket Description</th>
                        <th>Ticket Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ticket, index) in tickets" v-bind:key="ticket._id">
                        <th>{{ index }}</th>
                        <th>
                            <router-link :to="`tickets/${ticket._id}`">{{ ticket.title ? ticket.title : 'Name' }}</router-link>
                        </th>
                        <th>{{ ticket.text }}</th>
                        <th>{{ `${ticket.createdAt.getMonth()+1}/${ticket.createdAt.getDate()}/${ticket.createdAt.getFullYear()}` }}</th>
                    </tr>
                </tbody>
            </table>

            <div v-if="loading"><i class="fas fa-spinner fa-pulse"></i> Loading...</div>
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
.container {
    text-align: center;
}

.ticket-container {
    margin: 20px 0;
}
</style>