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
                        label="Project Title"
                        :rules="titleRules"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-text-field
                        v-model="description"
                        :rules="descRules"
                        label="Project Description"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>

            

            <v-row>
                <v-col>
                    <v-autocomplete
                        ref="autocomplete"
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
                    </v-autocomplete>
                </v-col>
            </v-row>
            
            <v-row v-if="project">
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
                        Delete Project
                    </v-btn>
                    </template>
            
                    <v-card>
                    <v-card-title class="headline grey lighten-2">
                        Delete This Project?
                    </v-card-title>
            
                    <v-card-text class="mt-2">
                        Are you sure you would like to delete this project? This action cannot be undone.
                    </v-card-text>
            
                    <v-divider></v-divider>
            
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="red lighten-2"
                            dark
                            @click="deleteProject"
                        >
                        Delete
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                
                <v-col class="text-right">
                    <v-btn class="primary mr-2" @click.prevent="updateProject">Update</v-btn>
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
import UserService from '@/api/UserService';
import rulesMixin from '@/mixins/rulesMixin';
import { mapGetters } from 'vuex';

export default {
    name: 'EditProject',
    data() {
        return {
            title: '',
            description: '',
            users: [],
            assignedUsers: [],
            error: '',
            userSearch: '',
            loading: false,
            activeModal: false,
        }
    },
    props: {
        project: {
            type: Object
        }
    },
    mixins: [
        rulesMixin,
    ],
    async mounted() {
        this.loading = true;
        try {
            if(this.project) {
                this.description = this.project.description;
                this.title = this.project.title;
                this.assignedUsers = this.project.users;
            }
            let autocompleteInput = this.$refs.autocomplete.$refs.input;
            autocompleteInput.addEventListener('focus', this.onFocus, true);
            const userArray = await UserService.getUsers();
            this.users = userArray;
            this.loading = false;
        } catch(err) {
            this.loading = false;
            this.error = err;
            console.log(err);
            /*if(err.response.data.error) {
                this.error = err.response.data.error;
            } else {
                this.error = err;
            }*/
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        remove(item) {
            const index = this.assignedUsers.map(u => u.username).indexOf(item.username)
            if (index >= 0) this.assignedUsers.splice(index, 1)
        },
        onFocus() {
            this.$refs.autocomplete.isMenuActive = true;
        },
        createProject() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;
            const project = {
                title: this.title,
                description: this.description,
                userId: this.getUser().id,
                users: this.assignedUsers,
                username: this.getUser().username
            }
            ProjectService.createProject(project).then((res) => {
                if(res.status == 201) {
                    this.users = [];
                    const route = `/projects/${res.data.id}`;
                    ProjectService.getProjects().then(() => {
                        this.loading = false;
                        this.$router.push(route);
                    });
                }
            }).catch((err) => {
                this.loading = false;
                if(err.response?.data?.errors) {
                    this.error = err.response.data.errors.map(i => i.msg);
                } else if(err.response?.data?.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = err;
                }
            });
        },
        updateProject() {
            if(!this.$refs.form.validate()) return;
            if(!this.project) return;
            this.loading = true;
            const proj = {
                title: this.title,
                description: this.description,
                users: this.assignedUsers,
                id: this.project.id
            }
            ProjectService.updateProject(proj).then(() => {
                this.loading = false;
                this.$router.go(0);
            }).catch((err) => {
                this.loading = false;
                if(err.response.data.error) {
                    this.error = err.response.data.error;
                } else {
                    this.error = err;
                }
            });
        },
        deleteProject() {
            if(!this.project) return;
            ProjectService.deleteProject(this.project.id).then(() => {
                this.$router.push('/projects');
            })
        }
    }
}
</script>

<style scoped>

</style>