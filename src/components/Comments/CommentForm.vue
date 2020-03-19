<template>
    <div class="container">
        <div class="notification is-danger" v-if="error">{{ error }}</div>
        
        <div>
            <h2>Comments</h2>
            <div class="field">
                <div class="control">
                    <textarea class="textarea" type="text" id="create-ticket" v-model="text" placeholder="Leave a comment on this ticket" />
                </div>
                <div class="control">
                    <button class="button is-primary" :class="{ 'is-loading' : loading }" v-on:click="createComment">Create</button>
                </div>
            </div>
            
            <span v-if="loading">
                <i class="fas fa-spinner fa-pulse"></i> Loading...
            </span>
            <div v-else>
                <Comment v-for="comment in comments" :comment=comment :key="comment._id" />
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
            this.comments = await CommentService.getComments(this.$route.params.id);
            this.loading = false;
        } catch(err) {
            this.error = err.message;
            this.loading = false;
        }
    },
    methods: {
        ...mapGetters(['getUser']),
        createComment() {
            this.loading = true;
            const comment = {
                text: this.text,
                user: this.getUser().username,
                ticket: this.$route.params.id
            }
            CommentService.createComment(comment).then(() => {
                this.loading = false;
                this.text = '';
                this.$router.go(-1);
            }).catch((err) => {
                this.loading = false;
                this.error = err;
            });
        }
    }
    
}
</script>

<style scoped>
.container {
    text-align: center;
    margin: auto;
}
</style>