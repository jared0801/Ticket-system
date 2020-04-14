<template>
    <section class="page-header">

        <router-link v-if="backlink" class="button back-button" :to="backlink">
            <i class="fas fa-arrow-left"></i>
            <span style="padding-left: 10px">{{ backlinkText }}</span>
        </router-link>

        <a v-else-if="backlinkText" role="button" class="button back-button" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
            <span style="padding-left: 10px">{{ backlinkText }}</span>
        </a>



        <h1 class="title">{{ title }}</h1>

    </section>    
</template>

<script>
export default {
    name: "PageHeader",
    props: {
        title: {
            type: String,
            required: true
        },
        backlink: {
            type: String
        },
        // If backlinkText is provided but backlink is not, backlink will default to the last vue-router route
        backlinkText: {
            type: String
        }
    }
}
</script>

<style scoped>
.page-header {
    padding: 1.5em 0;
    text-align: center;
}

.header-menu {
    display: flex;
    justify-content: space-between;
}

.back-button {
}

.button-group {
    margin-right: 10%;
    display: flex;
    align-items: center;
}

.button-group .button {
    margin: 0 5px;
}

@media only screen and (max-width: 600px)  {
    .back-button {
        position: relative;
        left: 0;
        margin-bottom: 20px;
    }
}
</style>