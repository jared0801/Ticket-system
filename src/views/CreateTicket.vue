<template>
    <div class="create-ticket-wrapper">
        <h1 class="title">Create a ticket</h1>

        <router-link to="/tickets">View Tickets</router-link>
        <hr>
        
        <p class="error" v-if="error">{{ error }}</p>

        <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Create a ticket" />
        <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createTicket">Create</button> 
    </div>
</template>

<script>
import TicketService from '../api/TicketService';

export default {
    name: 'home',
    data() {
        return {
            text: '',
            error: '',
            loading: false
        }
    },
    components: {
    },
    methods: {
        createTicket() {
            this.loading = true;
            TicketService.insertPost(this.text).then(() => {
                this.loading = false;
                this.text = '';
            }).catch((err) => {
                this.error = err;
            });
        }
    }
};
</script>
