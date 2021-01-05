<template>
    <div class="card comment">
        <header class="card-header">
            <p>{{ comment.username }}</p>
            
            <div v-if="isCommenter" class="card-header-icon">
                <a @click="toggleEdit" role="button" class="edit" :class="{ 'selected' : editing }"><i class="fas fa-edit"></i></a>
                <a @click="deleteConfirmation" role="button" class="delete" aria-label="delete comment"></a>
                <Modal v-if="confirmDelete"
                    content="Are you sure you would like to delete this comment?"
                    buttonText="Delete"
                    aria="Confirm deletion"
                    v-on:toggle-modal="deleteConfirmation"
                    v-on:confirm="deleteComment"
                    classType="is-danger" />
            </div>
            <!-- <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
            </a> -->
        </header>
        <div class="card-content">
            <div class="notification is-danger" v-if="error">{{ error }}</div>
            <div v-if="editing">
                <div class="field">
                    <div class="control">
                        <textarea class="textarea" type="text" id="edit-ticket" v-model="text" />
                    </div>
                    <div class="control button-div submit-control">
                        <button class="button is-primary submit-button" :class="{ 'is-loading' : loading }" v-on:click="updateComment">Update</button>
                    </div>
                </div>
            </div>
            <div v-else class="comment-content">
                {{ comment.text }}
                <div class="help">
                    <time v-if="comment.updatedAt" :datetime="comment.createdAt">
                        <br>
                        Last Edited: {{ updatedDateTime }}
                    </time>
                    <br>
                    <time :datetime="comment.createdAt">
                        Created: {{ createdDateTime }}
                    </time>
                </div>
            </div>
        </div>
    </div>
    
    
</template>

<script>
import CommentService from '@/api/CommentService';
import Modal from '@/components/Modal.vue';
import { mapGetters } from 'vuex';

export default {
    name: "CommentForm",
    data() {
        return {
            editing: false,
            text: '',
            error: '',
            loading: false,
            confirmDelete: false,
        }
    },
    components: {
        Modal
    },
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    created() {
        this.text = this.comment.text;
    },
    methods: {
        toggleEdit() {
            this.editing = !this.editing;
        },
        updateComment() {
            this.loading = true;
            const comment = {
                id: this.comment.id,
                userId: this.getUser.id,
                text: this.text
            }
            CommentService.updateComment(comment).then(() => {
                this.loading = false;
                this.$router.go(0);
            }).catch(err => {
                this.error = err.response.data.error;
                this.loading = false;
            })
        },
        deleteComment() {
            this.loading = true;
            CommentService.deleteComment(this.comment.id).then(() => {
                this.loading = false;
                this.$router.go(0);
            }).catch(err => {
                this.error = err.response.data.error;
                this.loading = false;
            })
        },
        deleteConfirmation() {
            this.confirmDelete = !this.confirmDelete;
        }
    },
    computed: {
        ...mapGetters('user', ['getUser']),
        isCommenter() {
            return this.getUser.username === this.comment.username;
        },
        createdDateTime() {
            let hours = this.comment.createdAt.getHours();
            let minutes = this.comment.createdAt.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return `${hours}:${minutes} ${ampm} - ${this.comment.createdAt.getMonth()+1}/${this.comment.createdAt.getDate()}/${this.comment.createdAt.getFullYear()}`;
        },
        updatedDateTime() {
            let hours = this.comment.updatedAt.getHours();
            let minutes = this.comment.updatedAt.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // The hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return `${hours}:${minutes} ${ampm} - ${this.comment.updatedAt.getMonth()+1}/${this.comment.updatedAt.getDate()}/${this.comment.updatedAt.getFullYear()}`;
        }
    }
    
}
</script>

<style scoped lang="scss">

.comment {
    margin-bottom: 10px;
    background-color: #f3f3f3;
}

.comment-content {
    text-align: center;
    margin: 0;
    width: 100%;
}

.help {
    text-align: center;
}

.card-header {
    display: flex;
    justify-content: space-between;
    padding: 1em 1.5em;
}

.card-header > p {
    margin: 0;
}

.card-header-icon {
    padding: 0;
}


.submit-control {
    text-align: right;
    margin: 1em 0;
}

.edit {
    margin-right: 1em;
    color: lightgray;
}
/*.edit:hover {
    color: $grey-light;
}
.selected {
    color: $blue;
}*/
</style>