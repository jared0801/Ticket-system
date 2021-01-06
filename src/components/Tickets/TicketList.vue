<template>
    <div class="ticket-list">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        

        <div class="tabs">
            <v-tabs v-model="resolved_tab">
                <v-tab>
                    <i class="mr-2 fas fa-ticket-alt" aria-hidden="true"></i>
                    <span>Open Tickets</span>
                </v-tab>
                <v-tab>
                    <i class="mr-2 far fa-check-square" aria-hidden="true"></i>
                    <span>Completed Tickets</span>
                </v-tab>
            </v-tabs>
            <!-- <ul>
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
            </ul> -->
        </div>

        <div class="ticket-container">

            <div v-if="loading"><i class="fas fa-spinner fa-pulse"></i> Loading...</div>
            <v-data-table
                v-else
                :headers="headers"
                :items="items"
                :items-per-page="10"
                class="elevation-1 data-table"
                @click:row="selectTicket"
            >
                <template v-slot:[`item.title`]="{ item }">
                    <div v-html="item.title"></div>
                </template>
                <template v-slot:[`item.priority_id`]="{ item }">
                    <div>{{item.priority}}</div>
                </template>
                <template v-slot:[`item.createdAt`]="{ item }">
                    <span>{{ item.createdAt | dateToHuman }}</span>
                </template>
                <template v-slot:[`item.description`]="{ item }">
                    <div v-html="item.description" class="text-truncate" style="max-width: 300px"></div>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import TicketService from '@/api/TicketService';

export default {
    name: "TicketList",
    computed: {
        items() {
            if(this.resolved_tab) {
                return this.resolved_tickets;
            } else {
                return this.unresolved_tickets;
            }
        }
    },
    methods: {
        selectTicket(ticket) {
            this.$router.push(`/projects/${this.$route.params.id}/tickets/${ticket.id}`)
        }
    },
    filters: {
        dateToHuman(t) {
            t = new Date(t);
            return `${t.getMonth()+1}/${t.getDate()}/${t.getFullYear()}`;
        }
    },
    data() {
        return {
            resolved_tab: 0,
            resolved_tickets: [],
            unresolved_tickets: [],
            error: '',
            loading: false,
            headers: [
                {
                    text: 'Title',
                    value: 'title'
                },
                {
                    text: 'Type',
                    value: 'type'
                },
                {
                    text: 'Priority',
                    value: 'priority_id'
                },
                {
                    text: 'Status',
                    value: 'status'
                },
                {
                    text: 'Description',
                    value: 'description'
                },
                {
                    text: 'Submitter',
                    value: 'submitter'
                },
                {
                    text: this.resolved_tab ? 'Completed' : 'Created',
                    value: this.resolved_tab ? 'resolvedAt' : 'createdAt'
                }
            ]
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

.data-table >>> tbody td {
  height: 60px !important;
}

.data-table >>> tbody tr:hover {
  cursor: pointer;
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

@media only screen and (max-width: 925px) {

    .ticket-description {
        max-width: none;
    }
	
	/*
	Label the data
	*/
	td:nth-of-type(1):before { content: "Title"; }
	td:nth-of-type(2):before { content: "Type"; }
	td:nth-of-type(3):before { content: "Priority"; }
	td:nth-of-type(4):before { content: "Status"; }
	td:nth-of-type(5):before { content: "Description"; }
	td:nth-of-type(6):before { content: "Submitter"; }
	td.created:nth-of-type(7):before { content: "Created"; }
	td.completed:nth-of-type(7):before { content: "Completed"; }
}
</style>