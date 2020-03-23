<template>
    <div class="ticket">
        
        <Header :title="`Ticket: ${ticket.title}`" backlinkText="Back" />

        <div class="content">
            
            <div class="box">
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>
                <div v-else>
                    <section v-if="!editting" class="card section">
                        <div class="field button-div">
                            <div v-if="isSubmitter" class="control">
                                <button class="button is-info editButton" v-on:click="editTicket">Edit Ticket</button>
                            </div>
                            <div class="control">
                                <button v-if="ticket.resolvedAt" class="button is-danger resolveButton" v-on:click="unresolveTicket">Mark As Incomplete</button>
                                <button v-else class="button is-success resolveButton" v-on:click="resolveTicket">Mark As Complete</button>
                            </div>
                        </div>
                        <div class="field">
                            <p>Description: {{ ticket.text }}</p>
                        </div>
                        <div class="field">
                            <p>Assigned Users: <span v-for="user in ticket.assignedUsers" :key="user">{{ user }}</span></p>
                        </div>
                    </section>
                    <section class="card section" v-else>
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
import EditTicket from '@/components/EditTicket';
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
            editting: false
        }
    },
    computed: {
        isSubmitter() {
            return this.ticket.user === this.getUser().username;
        }
    },
    async created() {
        this.loading = true;
        try {
            this.ticket = await TicketService.getTicket(this.$route.params.id);
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    },
    methods: {
        ...mapGetters(['getUser']),
        editTicket() {
            this.editting = !this.editting;
        },
        resolveTicket() {
            if(!this.ticket.resolvedAt) {
                TicketService.resolveTicket(this.ticket._id).then(() => {
                    this.$router.go(-1);
                }).catch(err => {
                    this.error = err;
                });
            }
        },
        unresolveTicket() {
            if(this.ticket.resolvedAt) {
                TicketService.unresolveTicket(this.ticket._id).then(() => {
                    this.$router.go(-1);
                }).catch(err => {
                    this.error = err;
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
</style>