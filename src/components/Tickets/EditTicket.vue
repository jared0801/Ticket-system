<template>
    <v-form ref="form">
        <v-container>

            <v-row v-if="error" class="red lighten-2 mb-4 ma-1">
                <v-col>
                    <span class="white--text">{{error}}</span>
                </v-col>
            </v-row>


            <v-row>
                <v-col>
                    <v-text-field
                        v-model="title"
                        label="Ticket Title"
                        :rules="titleRules"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-select :rules="typeRules" v-model="type_id" :items="types" label="Type"></v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-select :rules="priorityRules" v-model="priority_id" :items="priorities" label="Priority"></v-select>
                </v-col>
            </v-row>
            

            <v-row>
                <v-col>
                    <v-autocomplete
                        v-model="assignedUsers"
                        :items="users"
                        @change="userSearch = ''"
                        :search-input.sync="userSearch"
                        outlined
                        return-object
                        chips
                        hide-selected
                        hide-no-data
                        color="blue-grey lighten-2"
                        label="Assign this ticket"
                        item-text="username"
                        item-value="username"
                        multiple
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                v-bind="data.attrs"
                                :input-value="data.selected"
                                close
                                @click="data.select"
                                @click:close="remove(data.item)"
                            >
                                {{ data.item.username }}
                            </v-chip>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>

            
            <v-row>
                <v-col>
                    <v-textarea
                        v-model="description"
                        label="Ticket Description"
                        required
                        outlined
                        :rules="descRules"
                    ></v-textarea>
                </v-col>
            </v-row>
            
            <v-row v-if="ticket">
                <v-dialog
                    v-model="activeModal"
                    width="500"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="red lighten-2"
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        Delete Ticket
                    </v-btn>
                    </template>
            
                    <v-card>
                    <v-card-title class="headline grey lighten-2">
                        Delete This Ticket?
                    </v-card-title>
            
                    <v-card-text class="mt-2">
                        Are you sure you would like to delete this ticket? This action cannot be undone.
                    </v-card-text>
            
                    <v-divider></v-divider>
            
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="red lighten-2"
                            dark
                            @click="deleteTicket"
                        >
                        Delete
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                
                <v-col class="text-right">
                    <v-btn class="primary mr-2" @click.prevent="updateTicket">Update</v-btn>
                    <v-btn class="secondary" @click="closeTicket">Close</v-btn>
                </v-col>
            </v-row>

            <v-row v-else class="ma-1">
                <v-btn class="primary" :class="{ 'is-loading' : loading }" @click.prevent="createTicket">Create</v-btn>
            </v-row>


        </v-container>
    </v-form>
</template>

<script>
import TicketService from '@/api/TicketService';
import UserService from '@/api/UserService';
//import Modal from '@/components/Modal';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'EditTicket',
    data() {
        return {
            title: '',
            description: '',
            error: '',
            userSearch: '',
            assignedUsers: [],
            users: [],
            loading: false,
            activeModal: false,
            type_id: 1,
            priority_id: 1,
            titleRules: [
                t => !!t || "A title is required.",
                t => (t.length > 2 && t.length < 33) || "Title must be between 3 and 32 characters long."
            ],
            descRules: [
                d => !!d || "A description is required."
            ],
            typeRules: [
                d => !!d || "A type is required."
            ],
            priorityRules: [
                d => !!d || "A priority is required."
            ],
            types: [
                {
                    text: "Bug / Error",
                    value: 1
                },
                {
                    text: "Feature Request",
                    value: 2
                },
                {
                    text: "Project Proposal",
                    value: 3
                },
                {
                    text: "Training",
                    value: 4
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
        }
    },
    props: {
        ticket: {
            type: Object
        }
    },
    components: {
        //Modal
    },
    async mounted() {
        this.loading = true;
        try {
            if(this.ticket) {
                this.title = this.ticket.title;
                this.description = this.ticket.description;
                this.assignedUsers = this.ticket.users;
                this.type_id = this.ticket.type_id;
                this.priority_id = this.ticket.priority_id;
            }
            const userArray = await UserService.getUsers();
            this.users = userArray;
            this.loading = false;
        } catch(err) {
            this.loading = false;
            this.error = err;
        }
    },
    methods: {
        ...mapActions('tickets', ['getAppData']),
        ...mapGetters('user', ['getUser']),
        toggleModal() {
            this.activeModal = !this.activeModal;
        },
        createTicket() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;
            const ticket = {
                title: this.title,
                description: this.description,
                userId: this.getUser().id,
                users: this.assignedUsers,
                project_id: this.$route.params.id,
                resolvedAt: '',
                username: this.getUser().username,
                status_id: 0,
                type_id: this.type_id,
                priority_id: this.priority_id
            }
            TicketService.createTicket(ticket).then(() => {
                this.loading = false;
                this.description = '';
                this.title = '';
                this.getAppData().then(() => {
                    this.$router.push(`/projects/${this.$route.params.id}`);
                })
            }).catch((err) => {
                this.loading = false;
                if(err.response?.data?.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = err;
                }
            });
        },
        updateTicket() {
            if(!this.$refs.form.validate()) return;
            if(!this.ticket) return;
            this.loading = true;
            const ticket = {
                title: this.title,
                description: this.description,
                user: this.ticket.user,
                users: this.assignedUsers,
                project_id: this.ticket.project_id,
                status_id: this.ticket.status_id,
                type_id: this.type_id,
                priority_id: this.priority_id,
                id: this.ticket.id,
            }
            TicketService.updateTicket(ticket).then(() => {
                this.loading = false;
                this.$router.go(0);
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        },
        deleteTicket() {
            this.loading = true;
            TicketService.deleteTicket(this.ticket.id).then(() => {
                this.loading = false;
                this.$router.push(`/projects/${this.ticket.project_id}`);
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
                this.assignedUsers.push(this.users.find(u => u.username == arg.item));
            }

            // Refilter results
            this.inputChangeHandler(arg.item);
            arg.item = '';

        },
        inputChangeHandler(text) {
            const assignedUsers = this.assignedUsers;
            this.filteredUsers = this.users.filter(function(item) {
                return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1 && !assignedUsers.some(i => i.id == item.id);
            });
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