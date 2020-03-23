<template>
    <div>
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        <div class="field">
            <label class="label">Ticket Title</label>
            <div class="control">
                <input class="input" type="text" v-model="title" placeholder="Ticket title">
            </div>
        </div>

        <div class="field">
            <label class="label">Assign this ticket</label>
            <div class="control">
                <!-- <div class="select">
                    <select v-model="assignedUsers[0]">
                        <option disabled value="">Select dropdown</option>
                        <option v-for="user in users" :key="user">{{ user }}</option>
                    </select>
                </div> -->

                <vue-autosuggest
                :suggestions="filteredUsers"
                :input-props="{id:'autosuggest__input', placeholder:'Assign to', class: 'input'}"
                @selected="selectHandler"
                @input="inputChangeHandler"
                componentAttrClassAutosuggestResults="result-container dropdown-content"
                >
                    <template slot-scope="{suggestion}">
                        <span class="suggestion-item button">{{suggestion.item}}</span>
                    </template>
                </vue-autosuggest>
            </div>
        </div>

        <div class="field">
            <div>
                <label class="label">Assigned to: </label>
                <div v-for="(user, index) in assignedUsers" :key="user">{{ user }} <a class="delete" aria-label="remove assigned user" v-on:click="rmAssignedUser(index)"></a></div>
            </div>
        </div>

        <div class="field">
            <label class="label">Ticket Details</label>
            <div class="control">
                <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Ticket details" />
            </div>
        </div>
        
        <div class="field">
            <div v-if="ticket" class="control">
                <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="updateTicket">Update</button>
                <button class="button is-danger" style="margin-left: 1em" :class="{ 'is-loading' : loading }" v-on:click="closeTicket">Cancel</button>
            </div>
            <div v-else class="control">
                <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createTicket">Create</button>
            </div>
        </div>
    </div>    
</template>

<script>
import TicketService from '@/api/TicketService';
import UserService from '@/api/UserService';
import { VueAutosuggest } from 'vue-autosuggest';
import { mapGetters } from 'vuex';

export default {
    name: 'EditTicket',
    data() {
        return {
            title: '',
            text: '',
            usertext: '',
            error: '',
            assignedUsers: [],
            users: [],
            filteredUsers: [],
            loading: false
        }
    },
    props: {
        ticket: {
            type: Object
        }
    },
    components: {
        VueAutosuggest
    },
    async created() {
        this.loading = true;
        try {
            if(this.ticket) {
                this.title = this.ticket.title;
                this.text = this.ticket.text;
                this.assignedUsers = this.ticket.assignedUsers;
            }
            const userArray = await UserService.getUsers();
            this.users = [{
                data: userArray
            }];
            this.filteredUsers = this.users;
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    },
    methods: {
        ...mapGetters(['getUser']),
        createTicket() {
            this.loading = true;
            const ticket = {
                title: this.title,
                text: this.text,
                user: this.getUser().username,
                assignedUsers: this.assignedUsers,
                projId: this.$route.params.id,
                resolved: ''
            }
            TicketService.createTicket(ticket).then(() => {
                this.loading = false;
                this.text = '';
                this.title = '';
                this.$router.go(-1);
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        },
        updateTicket() {
            this.loading = true;
            const ticket = {
                title: this.title,
                text: this.text,
                user: this.ticket.user,
                assignedUsers: this.assignedUsers,
                projId: this.ticket.projId,
                id: this.ticket._id,
            }
            TicketService.updateTicket(ticket).then(() => {
                this.loading = false;
                this.text = '';
                this.title = '';
                this.$router.go(-1);
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        },
        closeTicket() {
            this.$emit('close-ticket');
        },
        rmAssignedUser(index) {
            this.assignedUsers.splice(index, 1);
        },
        selectHandler(arg) {
            if(arg) {
                this.assignedUsers.push(arg.item);
            }

            // Refilter results
            this.inputChangeHandler(arg.item);
            arg.item = '';

        },
        inputChangeHandler(text) {
            this.filteredUsers = this.users;
            // Filter results based on input & already assigned users
            const userArray = this.users[0].data.filter(item => {
                return item.toLowerCase().indexOf(text.toLowerCase()) > -1 && !this.assignedUsers.includes(item);
            });
            this.filteredUsers = [{
                data: userArray
            }];
        }
    }
};
</script>

<style scoped>
.input {
    margin-bottom: 10px;
}

.textarea {
    margin-bottom: 10px;
}
</style>