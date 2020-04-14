<template>
    <div>

        <div class="content">
            
            <Header title="Create a ticket" backlinkText="View Tickets" />

            <EditTicket />

        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import EditTicket from '@/components/EditTicket';

export default {
    name: 'CreateTicket',
    data() {
        return {
        }
    },
    components: {
        Header,
        EditTicket
    },
    created() {
    },
    methods: {
    }
};
</script>

<style scoped>

</style>