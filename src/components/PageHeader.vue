<template>
    <section class="page-header">

        <v-container>
            <v-row>
                <v-col>
                    <v-btn exact :to="backlink" v-if="backlink" class="mt-4 blue-grey darken-2 white--text">
                        <i class="fas fa-arrow-left"></i>
                        <span style="padding-left: 10px">{{ backlinkText }}</span>
                    </v-btn>
                    <v-btn v-else-if="backlinkText" class="mt-4 backlink-button" @click="$router.go(-1)">
                        <i class="fas fa-arrow-left"></i>
                        <span style="padding-left: 10px">{{ backlinkText }}</span>
                    </v-btn>
                </v-col>
            </v-row>

            <v-row>
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

.v-btn {
    margin: 1em;
}

</style>