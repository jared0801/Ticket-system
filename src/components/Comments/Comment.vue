<template>
    <v-card class="mb-2">
        <v-card-title>
            <v-row>
                <v-col>
                    <h3 class="title">{{comment.username}}</h3>
                </v-col>
                <v-col class="text-right">
                    <div v-if="isCommenter" class="card-header-icon">
                    <v-btn small text dark color="grey lighten-1" @click="toggleEdit" :class="{ 'selected' : editing }"><i class="fas fa-edit"></i></v-btn>

                    <v-dialog
                        v-model="confirmDelete"
                        width="500"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="red lighten-2"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            small
                            text
                        >
                            <i class="fas fa-times-circle"></i>
                        </v-btn>
                        </template>
                
                        <v-card>
                        <v-card-title class="headline grey lighten-2">
                            Delete This Comment?
                        </v-card-title>
                
                        <v-card-text class="mt-2">
                            Are you sure you would like to delete this comment? This action cannot be undone.
                        </v-card-text>
                
                        <v-divider></v-divider>
                
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="red lighten-2"
                                dark
                                @click="deleteComment"
                            >
                            Delete
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text v-if="editing">
            <v-row>
                <v-col>
                    <v-textarea full-width hide-details="auto" outlined v-model="text" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn class="primary" :class="{ 'is-loading' : loading }" v-on:click="updateComment">Update</v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-text v-else>
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
        </v-card-text>
    </v-card>
    
    
</template>

<script>
import CommentService from '@/api/CommentService';
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
    color: lightgray;
}
/*.edit:hover {
    color: $grey-light;
}
.selected {
    color: $blue;
}*/
</style>