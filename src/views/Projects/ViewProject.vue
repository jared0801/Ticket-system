<template>
    <div class="tickets">

        <div class="content">
            
            <PageHeader title="Project Tickets" backlinkText="Projects" backlink="/projects" />

            <v-container v-if="loading">
                <v-row justify="center">
                    <v-col class="flex-grow-0">
                        <v-progress-circular indeterminate />
                    </v-col>
                </v-row>
            </v-container>

            <v-container v-else>

                <v-row>
                    <v-col v-if="error" class="red lighten-2 mb-4 ma-1">
                        <span class="white--text">{{error}}</span>
                    </v-col>
                    <v-col v-else-if="success" class="blue lighten-2 mb-4 ma-1">
                        <span class="white--text">{{success}}</span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-btn @click="editProject" v-if="isLead" class="edit-button">Edit Project</v-btn>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn :to="{ name: 'create-ticket' }" class="primary create-button">Create a new ticket</v-btn>

                        <v-dialog
                            v-if="isAssignedUser"
                            class="text-right"
                            v-model="confirmLeave"
                            width="500"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                color="red lighten-2"
                                class="ml-3 leave-button"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                :loading="loading"
                            >
                                Leave This Project
                            </v-btn>
                            </template>
                    
                            <v-card>
                            <v-card-title class="headline grey lighten-2">
                                Leave This Project?
                            </v-card-title>
                    
                            <v-card-text class="mt-2">
                                Are you sure you would like to leave this project?
                            </v-card-text>
                    
                            <v-divider></v-divider>
                    
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="red lighten-2"
                                    dark
                                    @click="leaveProject"
                                >
                                Leave This Project
                                </v-btn>
                            </v-card-actions>
                            </v-card>
                        </v-dialog>

                    </v-col>
                </v-row>

                

                <v-row>
                    <div v-if="editing" class="project-info">
                        <EditProject :project="project" v-on:close-project="editProject" />
                    </div>

                    <v-card v-else class="project-info">
                        <v-card-text class="text--primary">
                            <div class="title text-center">
                                <h3 v-html="project.title"></h3>
                            </div>
                            <p v-html="project.description"></p>
                            <p>Lead: <v-chip color="primary" class="ma-1">{{ project.lead }}</v-chip></p>
                            <p>Users: <v-chip v-for="user in project.users" :key="user.id" color="secondary" class="ma-1">{{user.username}}</v-chip></p>
                        </v-card-text>
                    </v-card>
                </v-row>

                <v-row>
                    <TicketList />
                </v-row>
            
            </v-container>
        </div>
        
    </div>
</template>

<script>
import TicketList from '@/components/Tickets/TicketList';
import EditProject from '@/components/Projects/EditProject';
import ProjectService from '@/api/ProjectService';
import PageHeader from '@/components/PageHeader';
import { mapGetters } from 'vuex';

export default {
    name: 'ViewProject',
    components: {
        TicketList,
        PageHeader,
        EditProject
    },
    data() {
        return {
            project: {},
            editing: false,
            loading: false,
            error: '',
            success: '',
            confirmLeave: false,
        }
    },
    async created() {
        this.loading = true;
        try {
            const project = await ProjectService.getProject(this.$route.params.id);
            this.project = project;
        } catch(err) {
            this.$router.push('/projects');
        }
        this.loading = false;
    },
    computed: {
        isLead() {
            return this.project.lead === this.getUser().username;
        },
        isAssignedUser() {
            return this.project.users?.some(u => u.id === this.getUser().id);
        },
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        editProject() {
            this.editing = !this.editing;
        },
        leaveProject() {
            ProjectService.removeProjUser(this.$route.params.id, this.getUser().id).then(res => {
                if(res.status === 200) {
                    this.$router.push('/projects');
                } else {
                    this.error = "There was a problem leaving this project. Try again later.";
                }
            }).catch((err) => {
                console.log(err.response);
                if(err.response.status) {
                    this.error = err.response.data.error;
                }
                this.confirmLeave = false;
            });
        }
    }
};
</script>

<style scoped>
.project-info {
    margin: 1em 0;
    width: 100%;
}

.create-button, .edit-button, .leave-button {
    margin: 1em;
}
</style>