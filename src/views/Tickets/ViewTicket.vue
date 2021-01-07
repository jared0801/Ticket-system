<template>
    <v-container class="ticket">
            
        <Header :title="`${project.title} Tickets`" backlinkText="Project" :backlink="`/projects/${ticket.project_id}`" />


        <v-row v-if="error" class="red lighten-2 mb-4 ma-1">
            <v-col>
                <span class="white--text">{{error}}</span>
            </v-col>
        </v-row>

        <span v-if="loading">
            <i class="fas fa-spinner fa-pulse"></i> Loading...
        </span>

        <div v-else-if="editing">
            <EditTicket :ticket="ticket" :project="project" v-on:close-ticket="editTicket" />
        </div>
        <div v-else>
            <v-row>
                <v-col v-if="isSubmitter">
                    <v-btn @click="editTicket" class="editButton">Edit Ticket</v-btn>
                </v-col>
                <v-col v-if="isAssignedUser" class="text-right">
                    <v-btn v-if="ticket.resolvedAt" class="red lighten-2" v-on:click="unresolveTicket">Mark As Incomplete</v-btn>
                    <v-btn v-else class="primary resolveButton" v-on:click="resolveTicket">Mark As Complete</v-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                <v-card class="ticket-info">
                    <v-card-text class="text--primary">
                        <div class="title text-center mb-7">
                            <h3 v-html="ticket.title"></h3>
                        </div>
                        <p class="mb-7" v-html="ticket.description"></p>
                        <p>Type: <v-chip color="primary" class="ma-1">{{ ticket.type }}</v-chip></p>
                        <div v-if="isAssignedUser">
                            <v-select
                                v-model="setStatus"
                                :items="statuses"
                                label="Status"
                            ></v-select>
                        </div>
                        <p v-else>
                            Status: <v-chip color="secondary" class="ma-1">{{ ticket.status }}</v-chip>
                        </p>
                        <div v-if="isAssignedUser">
                            <v-select
                                v-model="setPriority"
                                :items="priorities"
                                label="Priority"
                            ></v-select>
                        </div>
                        <p v-else>
                            Priority: <v-chip color="tertiary" class="ma-1">{{ ticket.priority }}</v-chip>
                        </p>
                        <p>Submitter: <v-chip color="primary" class="ma-1">{{ ticket.submitter }}</v-chip></p>
                        <p>Assigned Users: <v-chip v-for="user in ticket.users" :key="user.id" color="secondary" class="ma-1">{{user.username}}</v-chip></p>
                    </v-card-text>


                    
                </v-card>
                </v-col>
            </v-row>
        
        </div>
        <div>
            <CommentForm />
        </div>
        
    </v-container>
</template>

<script>
import TicketService from '@/api/TicketService';
import ProjectService from '@/api/ProjectService';
import EditTicket from '@/components/Tickets/EditTicket';
import CommentForm from '@/components/Comments/CommentForm';
import Header from '@/components/Header';
import { mapGetters } from 'vuex';

export default {
    name: 'ViewTicket',
    components: {
        Header,
        CommentForm,
        EditTicket
    },
    data() {
        return {
            loading: false,
            ticket: {},
            project: {},
            editing: false,
            error: '',
            statuses: [
                {
                    text: "Open",
                    value: 0
                },
                {
                    text: "In Progress",
                    value: 1
                },
                {
                    text: "Blocked",
                    value: 2
                },
            ],
            priorities: [
                {
                    text: "Low",
                    value: 1
                },
                {
                    text: "Medium",
                    value: 2
                },
                {
                    text: "High",
                    value: 3
                },
                {
                    text: "Urgent",
                    value: 4
                },
            ],
            setStatus: undefined,
            setPriority: undefined
        }
    },
    computed: {
        isSubmitter() {
            return this.ticket.user_id === this.getUser().id;
        },
        isAssignedUser() {
            return this.ticket.users.some(t => t.id === this.getUser().id);
        }
    },
    async created() {
        this.loading = true;
        try {
            this.project = await ProjectService.getProject(this.$route.params.pid);
            this.ticket = await TicketService.getTicket(this.$route.params.pid, this.$route.params.tid);
            if(this.ticket.id == undefined) {
                this.$router.push(`/projects/${this.$route.params.pid}`)
            }
            this.setStatus = this.ticket.status_id;
            this.setPriority = this.ticket.priority_id;
            this.loading = false;
        } catch(err) {
            this.error = err.response.data.error;
            this.loading = false;
        }
    },
    watch: {
        setStatus: function(newVal, oldVal) {
            if(!this.loading && oldVal !== undefined) {
                this.updateTicketStatus(newVal);
            }
        },
        setPriority: function(newVal, oldVal) {
            if(!this.loading && oldVal !== undefined) {
                this.updateTicketPriority(newVal);
            }
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        editTicket() {
            this.editing = !this.editing;
        },
        updateTicketStatus(status) {
            this.loading = true;
            const ticket = {
                title: this.ticket.title,
                description: this.ticket.description,
                user: this.ticket.submitter,
                users: this.ticket.users,
                project_id: this.ticket.project_id,
                priority_id: this.ticket.priority_id,
                status_id: status,
                type_id: this.ticket.type_id,
                id: this.ticket.id,
            }
            TicketService.updateTicket(ticket).then(() => {
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        },
        updateTicketPriority(priority) {
            this.loading = true;
            const ticket = {
                title: this.ticket.title,
                description: this.ticket.description,
                user: this.ticket.submitter,
                users: this.ticket.users,
                project_id: this.ticket.project_id,
                status_id: this.ticket.status_id,
                priority_id: priority,
                type_id: this.ticket.type_id,
                id: this.ticket.id,
            }
            TicketService.updateTicket(ticket).then(() => {
                this.loading = false;
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        },
        resolveTicket() {
            if(!this.ticket.resolvedAt) {
                const ticket = {
                    id: this.ticket.id,
                    username: this.getUser().username
                }
                TicketService.resolveTicket(ticket).then(() => {
                    this.$router.go(-1);
                }).catch(err => {
                    console.log(err.response)
                    this.error = err.response.data.error;
                });
            }
        },
        unresolveTicket() {
            if(this.ticket.resolvedAt) {
                const ticket = {
                    id: this.ticket.id,
                    username: this.getUser().username
                }
                TicketService.unresolveTicket(ticket).then(() => {
                    this.$router.go(-1);
                }).catch(err => {
                    console.log(err.response)
                    this.error = err.response.data.error;
                });
            }
        }
    }
};
</script>

<style scoped>

.ticket-container {
    border: 1px solid black;
}

.section {
    margin-bottom: 1em;
    padding: 1.5em 1.5em;
}

.desc-field {
    margin-bottom: 3em;
}

.inline {
    display: inline-block;
    vertical-align: middle;
}

.ticket > .content > .box {
    min-width: 90%;
}
</style>