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
                    <tr v-for="project in getData.projects" v-bind:key="project.id">
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
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "ProjectList",
    data() {
        return {
            error: '',
            loading: false
        }
    },
    computed: {
        ...mapGetters('tickets', ['getData']),
    },
    methods: {
        ...mapActions('tickets', ['getAppData'])
    },
    async created() {
        await this.getAppData();
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