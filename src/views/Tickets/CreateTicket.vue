<template>
    <div>

        <div class="content">
            
            <PageHeader title="Create A Ticket" backlinkText="View Tickets" />

            <EditTicket :project=project />

        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
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
        PageHeader,
        EditTicket
    },
    async created() {
        this.project = await ProjectService.getProject(this.$route.params.id);
    },
};
</script>

<style scoped>

</style>