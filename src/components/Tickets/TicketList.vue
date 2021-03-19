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
        </div>

        <div class="ticket-container">

            <v-data-table
                :headers="headers"
                :items="items"
                :items-per-page="10"
                :loading="loading"
                class="elevation-1 data-table"
                @click:row="selectTicket"
            >
                <template v-slot:[`item.title`]="{ item }">
                    <div v-html="item.title" id="title" class="text-truncate" style="max-width: 200px"></div>
                </template>
                <template v-slot:[`item.priority_id`]="{ item }">
                    <div>{{ item.priority }}</div>
                </template>
                <template v-slot:[`item.createdAt`]="{ item }">
                    <span>{{ item.createdAt | dateToHuman }}</span>
                </template>
                <template v-slot:[`item.resolvedAt`]="{ item }">
                    <span>{{ item.createdAt | dateToHuman }}</span>
                </template>
                <template v-slot:[`item.dueAt`]="{ item }">
                    <span v-if="item.dueAt">{{ item.dueAt | dateToHuman }}</span>
                    <span v-else>
                        None
                    </span>
                </template>
                <template v-slot:[`item.description`]="{ item }">
                    <div v-html="item.description" id="description" class="text-truncate" style="max-width: 300px"></div>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import dateMixin from '@/mixins/dateMixin';
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
    mixins: [
        dateMixin,
    ],
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
                    text: 'Created',
                    value: 'createdAt'
                },
                {
                    text: 'Due',
                    value: 'dueAt'
                }
            ]
        }
    },
    watch: {
        resolved_tab(res) {
            if(res) {
                this.headers[6].text = 'Completed';
                this.headers[6].value = 'resolvedAt';
            } else {
                this.headers[6].text = 'Created';
                this.headers[6].value = 'createdAt';
            }
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

.data-table >>> thead tr th {
  white-space: nowrap;
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

@media only screen and (max-width: 600px) {
    #title {
        max-width: none !important;
    }
    .data-table >>> tbody td {
        height: 48px !important;
        justify-content: initial;
    }
    .data-table >>> tbody td > div:first-child {
        width: 90px;
    }
    .data-table >>> tbody tr > td:first-child > div:first-child {
        font-size: 1.3rem;
    }
    
}
</style>