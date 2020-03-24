import axios from 'axios';

const url = process.env.VUE_APP_API + '/comments';

class CommentService {
    // Get comments
    static getComments(ticketId) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${ticketId}`).then((res) => {
                const data = res.data;
                resolve(data.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    lastEdit: comment.lastEdit ? new Date(comment.lastEdit) : ''
                })));
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create comments
    static createComment(comment) {
        return axios.post(url, {
            ...comment
        });
    }

    
    // Update a comment
    static updateComment(comment) {
        return axios.post(`${url}/${comment.id}`, {
            ...comment
        });
    }

    // Delete comments
    static deleteComment(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default CommentService;