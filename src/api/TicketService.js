import axios from 'axios';

const url = process.env.VUE_APP_API + '/tickets';

class TicketService {
    // Get tickets
    static getTickets(projId) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${projId}`).then((res) => {
                const data = res.data;
                resolve(data.map(ticket => ({
                    ...ticket,
                    createdAt: new Date(ticket.createdAt)
                })));
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Get a single ticket
    static getTicket(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/ticket/${id}`).then((res) => {
                const ticket = res.data;
                resolve({
                    ...ticket,
                    createdAt: new Date(ticket.createdAt)
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create tickets
    static createTicket(ticket) {
        return axios.post(url, {
            ...ticket
        });
    }

    // Delete tickets
    static deleteTicket(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default TicketService;