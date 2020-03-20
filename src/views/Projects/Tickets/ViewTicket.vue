<template>
    <div class="ticket">
        
        <Header :title="`Ticket: ${ticket.title}`" backlinkText="Back" />

        <div class="content">
            
            <div class="box">
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>
                <div v-else>
                    <section class="card section">
                        <div class="field button-div">
                            <div class="control">
                                <button class="button is-info editButton" v-on:click="editTicket">Edit Ticket</button>
                            </div>
                            <div class="control">
                                <button v-if="ticket.resolved" class="button is-danger resolveButton" v-on:click="unresolveTicket">Mark As Incomplete</button>
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
                    <CommentForm />
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import TicketService from '@/api/TicketService';
import CommentForm from '@/components/Comments/CommentForm'
import Header from '@/components/Header';

export default {
    name: 'ViewTicket',
    components: {
        Header,
        CommentForm
    },
    data() {
        return {
            loading: false,
            ticket: {}
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
        editTicket() {

        },
        resolveTicket() {
            if(!this.ticket.resolved) {
                TicketService.resolveTicket(this.ticket._id).then(() => {
                    this.$router.go(-1);
                }).catch(err => {
                    this.error = err;
                });
            }
        },
        unresolveTicket() {
            if(this.ticket.resolved) {
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

.button-div {
    display: flex;
    justify-content: flex-end;
}
.button-div .control {
    margin-left: 1em;
}

.section {
    margin-bottom: 1em;
    padding: 1.5em 1.5em;
}
</style>