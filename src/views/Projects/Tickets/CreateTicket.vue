<template>
    <div>
        <Header title="Create a ticket" backlink="/tickets" backlinkText="View Tickets" />

        <div class="content">

            <div class="notification is-danger" v-if="error">{{ error }}</div>

            <div class="field">
                <label class="label">Ticket Title</label>
                <div class="control">
                    <input class="input" type="text" v-model="title" placeholder="Ticket title">
                </div>
            </div>

            <div class="field">
                <label class="label">Ticket Details</label>
                <div class="control">
                    <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Ticket details" />
                </div>
            </div>
            
            <div class="field">
                <div class="control">
                    <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createTicket">Create</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import TicketService from '@/api/TicketService';
import { mapGetters } from 'vuex';

export default {
    name: 'CreateTicket',
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
        ...mapGetters(['getUser']),
        createTicket() {
            this.loading = true;
            const ticket = {
                title: this.title,
                text: this.text,
                user: this.getUser().username,
                projId: this.$route.params.id
            }
            TicketService.createTicket(ticket).then(() => {
                this.loading = false;
                this.text = '';
                this.title = '';
                this.$router.push('/');
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