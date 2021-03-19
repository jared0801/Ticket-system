<template>
    <div>
        <div class="content">
            
            <PageHeader title="Create a project" backlink="/projects" backlinkText="Projects" />

            <EditProject />
            
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import EditProject from '@/components/Projects/EditProject';

export default {
    name: 'CreateProject',
    data() {
        return {
        }
    },
    components: {
        PageHeader,
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