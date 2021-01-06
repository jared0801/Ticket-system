<template>
    <v-container>
        <v-row v-if="error" class="red lighten-2 mb-4 ma-1">
            <v-col>
                <span class="white--text">{{error}}</span>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col>
                <h2>Comments</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div>
                    <v-textarea hide-details="auto" outlined v-model="text" label="Leave a comment on this ticket" />

                    <v-btn class="primary mt-2" :class="{ 'is-loading' : loading }" @click.prevent="createComment">Submit</v-btn>
                </div>
                
                <span v-if="loading">
                    <i class="fas fa-spinner fa-pulse"></i> Loading...
                </span>

                <div class="mt-5" v-else>
                    <Comment v-for="comment in comments" :comment=comment :key="comment.id" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import CommentService from '@/api/CommentService';
import Comment from '@/components/Comments/Comment';
import { mapGetters } from 'vuex';

export default {
    name: "CommentForm",
    components: {
        Comment
    },
    data() {
        return {
            comments: [],
            text: '',
            error: '',
            loading: false
        }
    },
    async created() {
        this.loading = true;
        try {
            this.comments = await CommentService.getComments(this.$route.params.tid);
            this.loading = false;
        } catch(err) {
            this.error = err.response.data.error;
            this.loading = false;
        }
    },
    methods: {
        ...mapGetters('user', ['getUser']),
        createComment() {
            this.loading = true;
            const comment = {
                text: this.text,
                userId: this.getUser().id,
                ticketId: this.$route.params.tid
            }
            CommentService.createComment(comment).then(() => {
                this.loading = false;
                this.text = '';
                this.$router.go(0);
            }).catch((err) => {
                this.loading = false;
                this.error = err.response.data.error;
            });
        }
    }
    
}
</script>

<style scoped>
</style>