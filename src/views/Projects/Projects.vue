<template>
    <div class="projects">

        <div class="content">
            
            <PageHeader title="Projects" backlink="/dashboard" backlinkText="Dashboard" />

            <v-container>
                <v-row>
                    <v-col>
                        <v-btn to="/projects/create" class="primary create-button">Create a new project</v-btn>
                    </v-col>
                </v-row>

                <v-row>
                    <ProjectList />
                </v-row>
            </v-container>
        </div>
        
    </div>
</template>

<script>
import ProjectList from '@/components/Projects/ProjectList';
import PageHeader from '@/components/PageHeader';

export default {
    name: 'Projects',
    components: {
        ProjectList,
        PageHeader
    }
};
</script>

<style scoped>
.right-align {
    width: 100%;
    text-align: right;
}
.create-button {
    margin: 1em;
}
</style>