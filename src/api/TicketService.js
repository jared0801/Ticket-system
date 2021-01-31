import axios from 'axios';

const url = process.env.VUE_APP_API + '/tickets';

class TicketService {
    // Get tickets
    static getTickets(projId) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${projId}`).then((res) => {
                const tickets = {};
                if(res.data) {
                    tickets.resolved = res.data.resolved.map(ticket => ({
                        ...ticket,
                    }));
                    tickets.unresolved = res.data.unresolved.map(ticket => ({
                        ...ticket,
                    }));
                }
                resolve(tickets);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Get all tickets associated with a user
    static getAllTickets() {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/all`).then((res) => {
                let tickets = [];
                if(res.data) {
                    tickets = res.data;
                }
                resolve(tickets);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Get a single ticket
    static getTicket(pid, tid) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${pid}/ticket/${tid}`).then((res) => {
                const ticket = res.data;
                resolve(ticket);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create a ticket
    static createTicket(ticket) {
        return axios.post(url, ticket);
    }

    // Update a ticket
    static updateTicket(ticket) {
        return axios.post(`${url}/${ticket.id}`, ticket);
    }

    static resolveTicket(ticket) {
        const id = ticket.id;
        return new Promise((resolve, reject) => {
            axios.get(`${url}/res/${id}`).then((res) => {
                const ticketInfo = res.data;
                resolve({
                    ...ticketInfo,
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    static unresolveTicket(ticket) {
        const id = ticket.id;
        return new Promise((resolve, reject) => {
            axios.get(`${url}/unres/${id}`).then((res) => {
                const ticketInfo = res.data;
                resolve(ticketInfo);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Delete a ticket by id
    static deleteTicket(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default TicketService;