<template>
    <div class="tickets">
        <!-- <router-link to="/">Go home</router-link>
        <h1 class="title">Latest Tickets</h1>
        <hr> -->
        <Header title="Project Tickets" backlinkText="Back" />

        <div class="content">
            <div class="field button-div">      
                <div class="control">
                    <router-link class="button" :to="{ name: 'create-ticket' }">Create a ticket</router-link>
                </div>
                <div v-if="isLead" class="control">
                    <button class="button is-info editButton" v-on:click="editProject">Edit Project</button>
                </div>
            </div>
            <div v-if="editting" class="project-info">
                <EditProject :project="project" v-on:close-project="editProject" />
            </div>
            <div v-else class="project-info">
                <p>Project: {{ project.title }}</p>
                <p>Description: {{ project.description }}</p>
                <p>Lead: {{ project.lead }}</p>
            </div>
            <TicketList />
        </div>
        
    </div>
</template>

<script>
import TicketList from '@/components/TicketList';
import EditProject from '@/components/EditProject';
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
            editting: false
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
        ...mapGetters(['getUser']),
        editProject() {
            this.editting = !this.editting;
        }
    }
};
</script>

<style scoped>
.project-info {
    margin: 1em 0;
}
</style>