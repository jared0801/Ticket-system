<template>
    <div class="container">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        <div class="project-container">
            <table class="table is-bordered is-striped is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Lead</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(project, index) in projects" v-bind:key="project._id">
                        <th>{{ index+1 }}</th>
                        <th>
                            <router-link :to="`/projects/${project._id}`">{{ project.title }}</router-link>
                        </th>
                        <th class="project-description">{{ project.description }}</th>
                        <th>{{ project.lead }}</th>
                        <th>{{ `${project.createdAt.getMonth()+1}/${project.createdAt.getDate()}/${project.createdAt.getFullYear()}` }}</th>
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
            console.log(err);
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
</style>