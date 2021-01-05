<template>
    <v-form v-model="valid">
        <v-container>
            <div class="notification is-danger" v-if="serverError">{{ serverError }}</div>


            <v-row class="field">
                <v-col>
                    <v-text-field
                        v-model="title"
                        label="Project Title"
                        required
                    ></v-text-field>
                </v-col>
                <!--
                <p v-if="errors['title']" class="help is-danger">{{ errors['title'] }}</p> -->
            </v-row>

            <v-row class="field">
                <v-col>
                    <v-text-field
                        v-model="description"
                        label="Project Description"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            

            <v-row class="field">
                <v-col>
                    <v-autocomplete
                        v-model="assignedUsers"
                        :items="filteredUsers"
                        filled
                        chips
                        color="blue-grey lighten-2"
                        label="Assigned Users"
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

                        <template v-slot:item="data">
                            <v-list-item-content v-text="data.item.username"></v-list-item-content>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            
            <v-row v-if="project">
                <!-- <div class="control delete-control">
                    <button class="button is-danger" v-on:click.prevent="toggleModal">Delete Project</button>
                    <Modal v-show="activeModal"
                        content="Are you sure you would like to delete this project? This will delete all tickets associated with this project."
                        buttonText="Delete"
                        aria="Confirm deletion"
                        v-on:toggle-modal="toggleModal"
                        v-on:confirm="deleteProject"
                        classType="is-danger" />
                </div>
                <div class="control">
                    <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="updateProject">Update</button>
                </div>
                <div v-if="project" class="control">
                    <button class="button is-warning" v-on:click="$emit('close-project')">Close</button>
                </div> -->
                <v-col>
                    <v-btn class="warning mr-2" @click.prevent="toggleModal">Delete Project</v-btn>
                </v-col>
                <Modal v-show="activeModal"
                        content="Are you sure you would like to delete this project? This will delete all tickets associated with this project."
                        buttonText="Delete"
                        aria="Confirm deletion"
                        v-on:toggle-modal="toggleModal"
                        v-on:confirm="deleteProject"
                        classType="is-danger" />
                
                <v-col class="text-right">
                    <v-btn class="primary mr-2" @click="updateProject">Update</v-btn>
                    <v-btn class="secondary" @click="$emit('close-project')">Close</v-btn>
                </v-col>
            </v-row>

            <v-row v-else class="ma-1">
                <v-btn class="primary" :class="{ 'is-loading' : loading }" @click.prevent="createProject">Create</v-btn>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import Modal from '@/components/Modal';
import UserService from '@/api/UserService';
import { mapGetters } from 'vuex';

export default {
    name: 'EditProject',
    data() {
        return {
            valid: false,
            title: '',
            description: '',
            users: [],
            filteredUsers: [],
            assignedUsers: [],
            serverError: '',
            errors: {},
            loading: false,
            activeModal: false
        }
    },
    components: {
        Modal
    },
    props: {
        project: {
            type: Object
        }
    },
    async mounted() {
        this.loading = true;
        try {
            if(this.project) {
                this.description = this.project.description;
                this.title = this.project.title;
                this.assignedUsers = this.project.users;
            }
            const userArray = await UserService.getUsers();
            /*this.users = [{
                data: userArray
            }];
            this.filteredUsers = [{
                data: userArray.map(r => r.username)
            }]*/
            this.users = userArray;
            this.filteredUsers = userArray;
            if(this.assignedUsers.length) {
                this.filteredUsers = this.users.filter(item => {
                    return !this.assignedUsers.some(i => i.id==item.id);
                });
            }
            this.loading = false;
        } catch(err) {
            this.loading = false;
            this.serverError = err;
            console.log(err);
            /*if(err.response.data.error) {
                this.serverError = err.response.data.error;
            } else {
                this.serverError = err;
            }*/
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        remove(item) {
            console.log(item);
            const index = this.assignedUsers.indexOf(item.username)
            if (index >= 0) this.assignedUsers.splice(index, 1)
        },
        createProject() {
            this.loading = true;
            const project = {
                title: this.title,
                description: this.description,
                userId: this.getUser().id,
                users: this.assignedUsers,
                username: this.getUser().username
            }
            if(!project.title) {
                this.errors['title'] = "A title is required to create a project.";
                this.loading = false;
                return;
            }
            ProjectService.createProject(project).then((res) => {
                console.log(res);
                if(res.status == 201) {
                    this.title = '';
                    this.description = '';
                    this.users = [];
                    const route = `/projects/${res.data.id}`;
                    console.log(route);
                    ProjectService.getProjects().then(() => {
                        this.loading = false;
                        this.$router.push(route);
                    });
                }
            }).catch((err) => {
                this.loading = false;
                if(err.response?.data?.error) {
                    this.serverError = err.response.data.error;
                } else {
                    this.serverError = err;
                }
            });
        },
        updateProject() {
            this.loading = true;
            if(!this.project) return;
            const proj = {
                title: this.title,
                description: this.description,
                users: this.assignedUsers,
                id: this.project.id
            }
            if(!proj.title) {
                this.errors['title'] = "A title is required to create a project.";
                this.loading = false;
                return;
            }
            ProjectService.updateProject(proj).then(() => {
                this.loading = false;
                this.title = '';
                this.description = '';
                this.users = [];
                this.$router.push(`/projects/${proj.id}`);
            }).catch((err) => {
                this.loading = false;
                if(err.response.data.error) {
                    this.serverError = err.response.data.error;
                } else {
                    this.serverError = err;
                }
            });
        },
        deleteProject() {
            if(!this.project) return;
            ProjectService.deleteProject(this.project.id).then(() => {
                this.$router.push('/projects');
            })
        },
        toggleModal() {
            this.activeModal = !this.activeModal;
        },


        // assigning users
        /*rmAssignedUser(index) {
            this.assignedUsers.splice(index, 1);
        },
        selectHandler(arg) {
            if(arg) {
                this.assignedUsers.push(this.users.find(u => u.username == arg.item));
            }

            // Refilter results
            this.inputChangeHandler(arg.item);
            arg.item = '';

        },*/
        //inputChangeHandler(text) {
            // Filter results based on input & already assigned users
            /*const userArray = this.users[0].data.filter(item => {
                console.log(item);
                return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1 && !this.assignedUsers.includes(item.username);
            });
            this.filteredUsers = [{
                data: userArray
            }];*/
            /*this.filteredUsers = this.users.filter(item => {
                return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1 && !this.assignedUsers.some(i => i.id == item.id);
            });*/
        //}
    }
}
</script>

<style scoped>

</style>