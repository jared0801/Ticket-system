<template>
    <div class="container">
        <div class="notification is-danger" v-if="error">{{ error }}</div>
        
        <div>
            <h2>Comments</h2>
            <div class="field">
                <div class="control">
                    <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Leave a comment on this ticket" />
                </div>
                <div class="control submit-control">
                    <button class="button is-primary submit-button" :class="{ 'is-loading' : loading }" v-on:click.prevent="createComment">Submit</button>
                </div>
            </div>
            
            <span v-if="loading">
                <i class="fas fa-spinner fa-pulse"></i> Loading...
            </span>
            <div v-else>
                <Comment v-for="comment in comments" :comment=comment :key="comment.id" />
            </div>
        </div>
    </div>
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
.container {
    margin-top: 2em;
}

.submit-control {
    text-align: right;
    margin: 1em 0;
}
</style>