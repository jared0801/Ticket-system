<template>
    <div class="projects">
        <Header title="Projects" backlink="/" backlinkText="Go home" />

        <div class="content">
            <router-link class="button" to="/projects/create">Create a new project</router-link>
            <ProjectList />
        </div>
        
    </div>
</template>

<script>
import ProjectList from '@/components/ProjectList';
import Header from '@/components/Header';

export default {
    name: 'Tickets',
    components: {
        ProjectList,
        Header
    },
};
</script>

<style scoped>
</style>