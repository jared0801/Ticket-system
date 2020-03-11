import axios from 'axios';

const url = process.env.VUE_APP_API + '/tickets';

class TicketService {
    // Get tickets
    static getTickets() {
        return new Promise((resolve, reject) => {
            axios.get(url).then((res) => {
                const data = res.data;
                resolve(data.map(post => ({
                    ...post,
                    createdAt: new Date(post.createdAt)
                })));
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create tickets
    static insertPost(text) {
        return axios.post(url, {
            text
        });
    }

    // Delete tickets
    static deletePost(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default TicketService;