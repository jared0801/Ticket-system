<template>
    <div class="ticket-list">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        

        <div class="tabs is-boxed">
            <ul>
                <li class="tab" :class="{'is-active' : resolved_tab === false}">
                    <a @click="resolved_tab = false">
                        <span class="icon is-small"><i class="fas fa-ticket-alt" aria-hidden="true"></i></span>
                        <span>Open Tickets</span>
                    </a>
                </li>
                <li class="tab" :class="{'is-active' : resolved_tab === true}">
                    <a @click="resolved_tab = true">
                        <span class="icon is-small"><i class="far fa-check-square" aria-hidden="true"></i></span>
                        <span>Completed Tickets</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="ticket-container">
            <table class="table is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Submitter</th>
                        <th v-if="resolved_tab">Completed</th>
                        <th v-else>Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ticket in (resolved_tab ? resolved_tickets : unresolved_tickets)" v-bind:key="ticket.id">
                        <td>
                            <router-link :to="`/projects/${$route.params.id}/tickets/${ticket.id}`">{{ ticket.title ? ticket.title : 'Name' }}</router-link>
                        </td>
                        <td class="ticket-description">{{ ticket.text }}</td>
                        <td>{{ ticket.submitter }}</td>
                        <td class="completed" v-if="resolved_tab">{{ `${ticket.resolvedAt.getMonth()+1}/${ticket.resolvedAt.getDate()}/${ticket.resolvedAt.getFullYear()}` }}</td>
                        <td class="created" v-else>{{ `${ticket.createdAt.getMonth()+1}/${ticket.createdAt.getDate()}/${ticket.createdAt.getFullYear()}` }}</td>
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
import TicketService from '@/api/TicketService';

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
    async mounted() {
        this.loading = true;
        try {
            const tickets = await TicketService.getTickets(this.$route.params.id);
            if(tickets) {
                this.resolved_tickets = tickets.resolved;
                this.unresolved_tickets = tickets.unresolved;
            }
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    }
    
}
</script>

<style scoped>
.ticket-list {
    width: 100%;
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

.tabs > ul {
    margin: 0;
    padding: 5px 0;
}
.tab {
    box-shadow: 0px 1px 1px #888888;
    border-radius: 5px;
}
.tab:hover {
    background: white;
}
.tab.is-active {
    box-shadow: none;
}

@media only screen and (max-width: 760px) {

    .ticket-description {
        max-width: none;
    }
	
	/*
	Label the data
	*/
	td:nth-of-type(1):before { content: "Title"; }
	td:nth-of-type(2):before { content: "Description"; }
	td:nth-of-type(3):before { content: "Submitter"; }
	td.created:nth-of-type(4):before { content: "Created"; }
	td.completed:nth-of-type(4):before { content: "Completed"; }
}
</style>