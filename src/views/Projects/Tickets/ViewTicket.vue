<template>
    <div class="ticket">
        
        <Header :title="`Ticket: ${ticket.title}`" backlinkText="Back" />

        <div class="content">
            
            <div class="box">
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>
                <div v-else>
                    <p>Description: {{ ticket.text }}</p>
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
    }
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}
</style>