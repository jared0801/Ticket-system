<template>
    <div class="tickets">
        <!-- <router-link to="/">Go home</router-link>
        <h1 class="title">Latest Tickets</h1>
        <hr> -->

        <div class="content">
            
            <Header title="Project Tickets" backlinkText="Back" />

            <div class="right-align">
                <button v-if="isLead" class="button is-info editButton" v-on:click="editProject">Edit Project</button>
                <router-link class="button" :to="{ name: 'create-ticket' }">Create a ticket</router-link>
            </div>
            <div v-if="editting" class="project-info">
                <EditProject :project="project" v-on:close-project="editProject" />
            </div>
            <div v-else class="project-info">
                <p>Project: {{ project.title }}</p>
                <p>Description: {{ project.description }}</p>
                <p>Lead: {{ project.lead }}</p>
                <p>Users: <span v-for="(user, i) in project.users" :key="user.id">{{user.username}}<span v-if="i < project.users.length-1">, </span></span></p>
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
        ...mapGetters('user', ['getUser']),
        editProject() {
            this.editting = !this.editting;
        }
    }
};
</script>

<style scoped>
.project-info {
    margin: 1em 0;
    width: 100%;
}

.right-align {
    width: 100%;
    text-align: right;
}
</style>