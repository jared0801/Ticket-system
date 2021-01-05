<template>
    <div>
        <div class="content">
            
            <Header title="Create a project" backlink="/projects" backlinkText="Projects" />

            <EditProject />
            
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import EditProject from '@/components/Projects/EditProject';

export default {
    name: 'CreateProject',
    data() {
        return {
        }
    },
    components: {
        Header,
        EditProject
    },
    methods: {
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