<template>
    <div>

        <div class="content">
            
            <Header title="Create A Ticket" backlinkText="View Tickets" />

            <EditTicket :project=project />

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import EditTicket from '@/components/Tickets/EditTicket';
import ProjectService from '@/api/ProjectService';

export default {
    name: 'CreateTicket',
    data() {
        return {
            project: {}
        }
    },
    components: {
        Header,
        EditTicket
    },
    async created() {
        this.project = await ProjectService.getProject(this.$route.params.id);
    },
};
</script>

<style scoped>

</style>