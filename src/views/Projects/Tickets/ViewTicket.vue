<template>
    <div class="ticket">
        
        <Header :title="`Ticket: ${ticket.title}`" backlinkText="Back" />

        <div class="content">
            
            <div class="box">
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>
                <div v-else>
                    <div class="field">
                        <div class="control">
                            <button class="button is-info editButton" v-on:click="editTicket">Edit Ticket</button>
                        </div>
                    </div>
                    <div class="field">
                        <p>Description: {{ ticket.text }}</p>
                    </div>
                    <div class="field">
                        <p>Assigned Users: <span v-for="user in ticket.assignedUsers" :key="user">{{ user }}</span></p>
                    </div>
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
            
        }
    }
};
</script>

<style scoped>

.editButton {
    float: right;
}
</style>