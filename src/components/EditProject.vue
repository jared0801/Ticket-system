<template>
    <form>
        <div class="notification is-danger" v-if="serverError">{{ serverError }}</div>


        <div class="field">
            <label class="label">Project Title</label>
            <div class="control">
                <input class="input" :class="{ 'is-danger' : errors['title'] }" type="text" v-model="title" placeholder="Project title">
            </div>
            <p v-if="errors['title']" class="help is-danger">{{ errors['title'] }}</p>
        </div>

        <div class="field">
            <label class="label">Project Description</label>
            <div class="control">
                <textarea class="textarea" type="text" id="create-ticket" v-model="description" placeholder="Project description" />
            </div>
        </div>
        
        <div v-if="project" class="button-div field">
            <div class="control delete-control">
                <button class="button is-danger" v-on:click="toggleModal">Delete Project</button>
                <Modal v-if="activeModal"
                    content="Are you sure you would like to delete this project? This will delete all tickets associated with this project."
                    buttonText="Delete"
                    aria="Confirm deletion"
                    v-on:toggle-modal="toggleModal"
                    v-on:confirm="deleteProject"
                    classType="is-danger" />
            </div>
            <div class="control">
                <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="updateProject">Update</button>
            </div>
            <div v-if="project" class="control">
                <button class="button is-warning" v-on:click="$emit('close-project')">Close</button>
            </div>
        </div>
        <div v-else class="field button-div">
            <div class="control">
                <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click.prevent="createProject">Create</button>
            </div>
        </div>
    </form>
</template>

<script>
import ProjectService from '@/api/ProjectService';
import Modal from '@/components/Modal';
import { mapGetters } from 'vuex';

export default {
    name: 'EditProject',
    data() {
        return {
            title: '',
            description: '',
            users: [],
            serverError: '',
            errors: {},
            loading: false,
            activeModal: false
        }
    },
    components: {
        Modal
    },
    props: {
        project: {
            type: Object
        }
    },
    created() {
        if(this.project) {
            this.description = this.project.description;
            this.title = this.project.title;
        }
    },
    methods: {
        ...mapGetters(['getUser']),
        createProject() {
            this.loading = true;
            const project = {
                title: this.title,
                description: this.description,
                userId: this.getUser().id,
                users: this.users,
                username: this.getUser().username
            }
            if(!project.title) {
                this.errors['title'] = "A title is required to create a project.";
                this.loading = false;
                return;
            }
            ProjectService.createProject(project).then(() => {
                this.loading = false;
                this.title = '';
                this.description = '';
                this.users = [];
                this.$router.go(-1);
            }).catch((err) => {
                this.loading = false;
                if(err.response.data.error) {
                    this.serverError = err.response.data.error;
                } else {
                    this.serverError = err;
                }
            });
        },
        updateProject() {
            this.loading = true;
            if(!this.project) return;
            const project = {
                title: this.title,
                description: this.description,
                userId: this.project.userId,
                users: this.project.users,
                id: this.project._id
            }
            if(!project.title) {
                this.errors['title'] = "A title is required to create a project.";
                this.loading = false;
                return;
            }
            ProjectService.updateProject(project).then(() => {
                this.loading = false;
                this.title = '';
                this.description = '';
                this.users = [];
                this.$router.go(0);
            }).catch((err) => {
                this.loading = false;
                if(err.response.data.error) {
                    this.serverError = err.response.data.error;
                } else {
                    this.serverError = err;
                }
            });
        },
        deleteProject() {
            if(!this.project) return;
            ProjectService.deleteProject(this.project._id).then(() => {
                this.$router.go(-1);
            })
        },
        toggleModal() {
            this.activeModal = !this.activeModal;
        }
    }
}
</script>

<style scoped>

</style>