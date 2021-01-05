<template>
    <section class="page-header">

        <v-container>
            <v-row>
                <v-btn exact :to="backlink" v-if="backlink" class="mt-4">
                    <i class="fas fa-arrow-left"></i>
                    <span style="padding-left: 10px">{{ backlinkText }}</span>
                </v-btn>
                <v-btn v-else-if="backlinkText" class="mt-4" @click="$router.go(-1)">
                    <i class="fas fa-arrow-left"></i>
                    <span style="padding-left: 10px">{{ backlinkText }}</span>
                </v-btn>

                <v-col style="text-align: center;">
                    <h1 class="text-lg-h3">{{ title }}</h1>
                </v-col>
            </v-row>
        </v-container>

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