<template>
    <div>
        <Header title="Create a ticket" backlink="/tickets" backlinkText="View Tickets" />
        
        <p class="error" v-if="error">{{ error }}</p>

        <div class="content">

            <input class="input" type="text" v-model="title" placeholder="Ticket title" />
            <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Create a ticket" />
            <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createTicket">Create</button> 
        </div>
    </div>
</template>

<script>
import Header from '../components/Header';
import TicketService from '../api/TicketService';

export default {
    name: 'home',
    data() {
        return {
            title: '',
            text: '',
            error: '',
            loading: false
        }
    },
    components: {
        Header
    },
    methods: {
        createTicket() {
            this.loading = true;
            const ticket = {
                title: this.title,
                text: this.text
            }
            TicketService.insertTicket(ticket).then(() => {
                this.loading = false;
                this.text = '';
                this.title = '';
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        }
    }
};
</script>

<style scoped>
.content {
    margin: auto;
    width: 80%;
}

.input {
    margin-bottom: 10px;
}

.textarea {
    margin-bottom: 10px;
}
</style>