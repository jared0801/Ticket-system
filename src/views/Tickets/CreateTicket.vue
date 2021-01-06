<template>
    <div>

        <div class="content">
            
            <Header title="Create a ticket" backlinkText="View Tickets" />

            <EditTicket :project=project />

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import EditTicket from '@/components/Tickets/EditTicket';
import { mapGetters } from 'vuex';

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
    created() {
        this.project = this.getData.projects.filter(p => p.id == this.$router.params.id);
    },
    methods: {
        ...mapGetters('user', ['getData']),
    }
};
</script>

<style scoped>

</style>