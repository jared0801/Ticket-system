<template>
    <form>
        <div class="notification is-danger" v-if="serverError">{{ serverError }}</div>


        <div class="field">
            <label class="label">Project Title</label>
            <div class="control">
                <input class="input" :class="{ 'is-danger' : errors['title'] }" type="text" v-model="title" placeholder="Project title">
            </div>
            <p v-if="errors['title']" class="help is-danger">{{ errors['title'] }}</p>
        </div>

        <div class="field">
            <label class="label">Project Description</label>
            <div class="control">
                <textarea class="textarea" type="text" id="create-ticket" v-model="description" placeholder="Project description" />
            </div>
        </div>

        

        <div class="field">
            <label class="label">Assign users to this project</label>
            <div class="control">
                <!-- <div class="select">
                    <select v-model="assignedUsers[0]">
                        <option disabled value="">Select dropdown</option>
                        <option v-for="user in users" :key="user">{{ user }}</option>
                    </select>
                </div> -->

                <vue-autosuggest
                :suggestions="[{data: filteredUsers.map(r => r.username)}]"
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
                <div v-for="(user, index) in assignedUsers" :key="user.id">{{ user.username }} <a class="delete" aria-label="remove assigned user" v-on:click="rmAssignedUser(index)"></a></div>
            </div>
        </div>
        
        <div v-if="project" class="button-div field">
            <div class="control delete-control">
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
            </div>
        </div>
        <div v-else class="field button-div">
            <div class="control">
                <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click.prevent="createProject">Create</button>
            </div>
        </div>
    </form>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import Modal from '@/components/Modal';
import UserService from '@/api/UserService';
import { VueAutosuggest } from 'vue-autosuggest';
import { mapGetters } from 'vuex';

export default {
    name: 'EditProject',
    data() {
        return {
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
        Modal,
        VueAutosuggest
    },
    props: {
        project: {
            type: Object
        }
    },
    async created() {
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
                if(err.response.data.error) {
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
            // Filter results based on input & already assigned users
            /*const userArray = this.users[0].data.filter(item => {
                console.log(item);
                return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1 && !this.assignedUsers.includes(item.username);
            });
            this.filteredUsers = [{
                data: userArray
            }];*/
            this.filteredUsers = this.users.filter(item => {
                return item.username.toLowerCase().indexOf(text.toLowerCase()) > -1 && !this.assignedUsers.some(i => i.id == item.id);
            });
        }
    }
}
</script>

<style scoped>

</style>