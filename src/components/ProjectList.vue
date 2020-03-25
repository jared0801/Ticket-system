<template>
    <div class="container">
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
                    <tr v-for="project in projects" v-bind:key="project._id">
                        <td>
                            <router-link :to="`/projects/${project._id}`">{{ project.title }}</router-link>
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
import ProjectService from '../api/ProjectService';

export default {
    name: "ProjectList",
    data() {
        return {
            projects: [],
            error: '',
            loading: false
        }
    },
    async created() {
        this.loading = true;
        try {
            this.projects = await ProjectService.getProjects();
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    }
    
}
</script>

<style scoped>
.container {
    text-align: center;
    max-width: none;
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