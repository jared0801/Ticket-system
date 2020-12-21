<template>
    <div class="ticket">

        <div class="content">
            
            <Header :title="`Ticket: ${ticket.title}`" backlinkText="Back" />
            
            <div class="box">
                <div class="notification is-danger" v-if="error">{{ error }}</div>
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>
                <div v-else>
                    <section v-if="!editting" class="box section">
                        <div class="field button-div">
                            <div v-if="isSubmitter" class="control">
                                <button class="button is-info editButton" v-on:click="editTicket">Edit Ticket</button>
                            </div>
                            <div class="control">
                                <button v-if="ticket.resolvedAt" class="button is-danger resolveButton" v-on:click="unresolveTicket">Mark As Incomplete</button>
                                <button v-else class="button is-success resolveButton" v-on:click="resolveTicket">Mark As Complete</button>
                            </div>
                        </div>
                        <div class="field desc-field">
                            <p>{{ ticket.text }}</p>
                        </div>
                        <div class="field">
                            <p>Submitter: {{ ticket.submitter }}</p>
                        </div>
                        <div class="field">
                            <p>Assigned Users: 
                                <span v-for="(user, i) in ticket.users" :key="user.id">
                                    {{user.username}}<span v-if="i < ticket.users.length-1">, </span>
                                </span>
                                <span v-if="ticket.users.length == 0">
                                    None
                                </span>
                            </p>
                        </div>
                    </section>
                    <section class="box section" v-else>
                        <EditTicket :ticket="ticket" v-on:close-ticket="editTicket" />
                    </section>
                    <CommentForm />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import TicketService from '@/api/TicketService';
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
            editting: false,
            error: ''
        }
    },
    computed: {
        isSubmitter() {
            return this.ticket.user_id === this.getUser().id;
        }
    },
    async created() {
        this.loading = true;
        try {
            this.ticket = await TicketService.getTicket(this.$route.params.pid, this.$route.params.tid);
            this.loading = false;
        } catch(err) {
            this.error = err.response.data.error;
            this.loading = false;
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        editTicket() {
            this.editting = !this.editting;
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

.ticket > .content > .box {
    min-width: 90%;
}
</style>