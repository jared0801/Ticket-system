<template>
    <div>
        <Header title="Create a project" backlink="/" backlinkText="Go Home" />

        <div class="content">

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
            
            <div class="field">
                <div class="control">
                    <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createProject">Create</button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import ProjectService from '@/api/ProjectService';
//import UserService from '@/api/UserService';
import { mapGetters } from 'vuex';

export default {
    name: 'CreateProject',
    data() {
        return {
            title: '',
            description: '',
            users: [],
            serverError: '',
            errors: {},
            loading: false
        }
    },
    components: {
        Header
    },
    methods: {
        ...mapGetters(['getUser']),
        createProject() {
            this.loading = true;
            const project = {
                title: this.title,
                description: this.description,
                lead: this.getUser().username,
                users: this.users
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
                this.$router.push('/');
            }).catch((err) => {
                this.loading = false;
                if(err.response.data.message) {
                    this.serverError = err.response.data.message;
                } else {
                    this.serverError = err;
                }
            });
        }
    }
};
</script>

<style scoped>

.input {
    margin-bottom: 10px;
}

.textarea {
    margin-bottom: 10px;
}
</style>