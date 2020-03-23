<template>
    <div class="container">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        

        <div class="tabs is-boxed">
            <ul>
                <li :class="{'is-active' : resolved_tab === false}">
                    <a @click="resolved_tab = false">
                        <span class="icon is-small"><i class="fas fa-ticket-alt" aria-hidden="true"></i></span>
                        <span>Open Tickets</span>
                    </a>
                </li>
                <li :class="{'is-active' : resolved_tab === true}">
                    <a @click="resolved_tab = true">
                        <span class="icon is-small"><i class="far fa-check-square" aria-hidden="true"></i></span>
                        <span>Completed Tickets</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="ticket-container">
            <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Ticket Title</th>
                        <th>Ticket Description</th>
                        <th>Submitter</th>
                        <th v-if="resolved_tab">Ticket Completed</th>
                        <th v-else>Ticket Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(ticket, index) in (resolved_tab ? resolved_tickets : unresolved_tickets)" v-bind:key="ticket._id">
                        <th>{{ index+1 }}</th>
                        <th>
                            <router-link :to="`/tickets/${ticket._id}`">{{ ticket.title ? ticket.title : 'Name' }}</router-link>
                        </th>
                        <th class="ticket-description">{{ ticket.text }}</th>
                        <th>{{ ticket.user ? ticket.user : 'User' }}</th>
                        <th v-if="resolved_tab">{{ `${ticket.resolvedAt.getMonth()+1}/${ticket.resolvedAt.getDate()}/${ticket.resolvedAt.getFullYear()}` }}</th>
                        <th v-else>{{ `${ticket.createdAt.getMonth()+1}/${ticket.createdAt.getDate()}/${ticket.createdAt.getFullYear()}` }}</th>
                    </tr>
                </tbody>
            </table>

            <div v-if="!loading && (resolved_tab ? resolved_tickets : unresolved_tickets).length === 0" class="notification">
                <p v-if="resolved_tab">This project doesn't have any completed tickets yet.</p>
                <p v-else>This project doesn't have any tickets yet.</p>
            </div>

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
            resolved_tab: false,
            resolved_tickets: [],
            unresolved_tickets: [],
            error: '',
            loading: false
        }
    },
    async created() {
        this.loading = true;
        try {
            const tickets = await TicketService.getTickets(this.$route.params.id);
            this.resolved_tickets = tickets.resolved;
            this.unresolved_tickets = tickets.unresolved;
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
    max-width: none;
    margin-top: 1em;
}

.ticket-container {
    margin: 20px 0;
}

.ticket-description {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 30vw;
}
</style>