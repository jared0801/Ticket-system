<template>
    <div class="project-list">
        <div class="notification is-danger" v-if="error">{{ error }}</div>

        <div class="project-container">
            <v-data-table
                :headers="headers"
                :loading="loading"
                :items="projects"
                :items-per-page="10"
                class="elevation-1 data-table"
                @click:row="selectProj"
            >
                <template v-slot:[`item.title`]="{ item }">
                    <div v-html="item.title"></div>
                </template>
                <template v-slot:[`item.createdAt`]="{ item }">
                    <span>{{ item.createdAt | dateToHuman }}</span>
                </template>
            </v-data-table>
        </div>
    </div>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import DateMixin from '@/mixins/dateMixin';

export default {
    name: "ProjectList",
    data() {
        return {
            error: '',
            loading: false,
            projects: [],
            headers: [
                {
                    text: 'Title',
                    value: 'title'
                },
                {
                    text: 'Description',
                    value: 'description'
                },
                {
                    text: 'Lead',
                    value: 'lead'
                },
                {
                    text: 'Created',
                    value: 'createdAt'
                }
            ]
        }
    },
    mixins: [
        DateMixin,
    ],
    methods: {
        selectProj(proj) {
            this.$router.push(`/projects/${proj.id}`)
        }
    },
    async created() {
        ProjectService.getProjects().then(res => {
            this.projects = res;
        }).catch(() => {
            this.error = "There was an error loading your projects. Try again later.";
        });
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

.data-table >>> tbody tr:hover {
  cursor: pointer;
}

.data-table >>> thead tr th {
  white-space: nowrap;
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