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
                    createdAt: new Date(comment.createdAt)
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

    // Delete comments
    static deleteComment(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default CommentService;