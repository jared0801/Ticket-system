<template>
    <div>
        <Header title="Create a project" backlink="/" backlinkText="Go Home" />

        <div class="content">

            <EditProject />
            
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import EditProject from '@/components/EditProject';

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