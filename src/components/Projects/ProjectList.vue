<template>
    <div class="project-list">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        <div class="project-container">
            <table class="table is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Lead</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="project in projects" v-bind:key="project.id">
                        <td>
                            <router-link :to="`/projects/${project.id}`">{{ project.title }}</router-link>
                        </td>
                        <td class="project-description">{{ project.description }}</td>
                        <td>{{ project.lead }}</td>
                        <td>{{ `${project.createdAt.getMonth()+1}/${project.createdAt.getDate()}/${project.createdAt.getFullYear()}` }}</td>
                    </tr>
                </tbody>
            </table>

            <div v-if="loading"><i class="fas fa-spinner fa-pulse"></i> Loading...</div>
        </div>
    </div>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import { mapGetters } from 'vuex';

export default {
    name: "ProjectList",
    data() {
        return {
            projects: [],
            error: '',
            loading: false
        }
    },
    computed: {
        ...mapGetters('tickets', ['getProjects']),
    },
    methods: {
        getData() {
            ProjectService.getProjects().then((res) => {
                console.log(res);
                console.log(this.getProjects);
                this.projects = this.getProjects.projects;
            });
        }
    },
    watch:{
        $route: function(to, from){
            console.log(to);
            console.log(from);
            this.getData();
        }
    } ,
    created() {
        this.getData();
        /*this.loading = true;
        try {
            this.projects = await ProjectService.getProjects();
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }*/
    }
    
}
</script>

<style scoped>
.project-list {
    margin-top: 1em;
    width: 100%;
}

.project-container {
    margin: 20px 0;
}

.project-description {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 30vw;
}

@media only screen and (max-width: 760px) {

    .project-description {
        max-width: none;
    }
	
	/*
	Label the data
	*/
	td:nth-of-type(1):before { content: "Title"; }
	td:nth-of-type(2):before { content: "Description"; }
	td:nth-of-type(3):before { content: "Lead"; }
	td:nth-of-type(4):before { content: "Created"; }
}
</style>