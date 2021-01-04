<template>
    <div class="projects">

        <div class="content">
            
            <Header title="Projects" backlink="/dashboard" backlinkText="Dashboard" />
            <div class="right-align">
                <router-link class="button" to="/projects/create">Create a new project</router-link>
            </div>
            <ProjectList />
        </div>
        
    </div>
</template>

<script>
import ProjectList from '@/components/Projects/ProjectList';
import Header from '@/components/Header';

export default {
    name: 'Tickets',
    components: {
        ProjectList,
        Header
    }
};
</script>

<style scoped>
.right-align {
    width: 100%;
    text-align: right;
}
</style>