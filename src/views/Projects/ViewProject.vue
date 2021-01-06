<template>
    <div class="tickets">

        <div class="content">
            
            <Header title="Project Tickets" backlinkText="Projects" backlink="/projects" />

            <v-container>
                <v-row>
                    <v-col v-if="isLead">
                        <v-btn @click="editProject" class="editButton">Edit Project</v-btn>
                    </v-col>
                    <v-col class="text-right">
                        <v-btn :to="{ name: 'create-ticket' }">Create a new ticket</v-btn>
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
import Header from '@/components/Header';
import { mapGetters } from 'vuex';

export default {
    name: 'ViewProject',
    components: {
        TicketList,
        Header,
        EditProject
    },
    data() {
        return {
            project: {},
            editing: false
        }
    },
    async created() {
        const project = await ProjectService.getProject(this.$route.params.id);
        this.project = project;
    },
    computed: {
        isLead() {
            return this.project.lead === this.getUser().username;
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        editProject() {
            this.editing = !this.editing;
        }
    }
};
</script>

<style scoped>
.project-info {
    margin: 1em 0;
    width: 100%;
}
</style>