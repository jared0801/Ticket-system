<template>
    <div class="card comment">
        <header class="card-header">
            <p class="card-header-title">
                {{ comment.user }}
            </p>
            <!-- <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </a> -->
        </header>
        <div class="card-content">
            <div class="content">
                {{ comment.text }}
                <br>
                <time :datetime="comment.createdAt">
                    {{ dateTime }}
                </time>
            </div>
        </div>
        <footer v-if="getUser.username === comment.user" class="card-footer">
            <!-- TODO: Add comment edit/delete functionality -->
            <a href="#" class="card-footer-item">Edit</a>
            <a href="#" class="card-footer-item">Delete</a>
        </footer>
    </div>
    
    
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "CommentForm",
    data() {
        return {
        }
    },
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(['getUser']),
        dateTime() {
            let hours = this.comment.createdAt.getHours();
            let minutes = this.comment.createdAt.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return `${hours}:${minutes} ${ampm} - ${this.comment.createdAt.getMonth()+1}/${this.comment.createdAt.getDate()}/${this.comment.createdAt.getFullYear()}`;
        }
    }
    
}
</script>

<style scoped>
.comment {
    margin-bottom: 10px;
}
</style>