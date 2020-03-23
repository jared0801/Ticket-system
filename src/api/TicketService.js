import axios from 'axios';

const url = process.env.VUE_APP_API + '/tickets';

class TicketService {
    // Get tickets
    static getTickets(projId) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/${projId}`).then((res) => {
                const data = res.data;
                data.resolved = data.resolved.map(ticket => ({
                    ...ticket,
                    createdAt: new Date(ticket.createdAt),
                    resolvedAt: new Date(ticket.resolvedAt)
                }));
                data.unresolved = data.unresolved.map(ticket => ({
                    ...ticket,
                    createdAt: new Date(ticket.createdAt),
                    resolvedAt: ''
                }));
                resolve(data);
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
                    createdAt: new Date(ticket.createdAt),
                    resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : ''
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Create a ticket
    static createTicket(ticket) {
        return axios.post(url, {
            ...ticket
        });
    }

    // Update a ticket
    static updateTicket(ticket) {
        return axios.post(`${url}/${ticket.id}`, {
            ...ticket
        });
    }

    static resolveTicket(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/res/${id}`).then((res) => {
                const ticket = res.data;
                resolve({
                    ...ticket,
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    static unresolveTicket(id) {
        return new Promise((resolve, reject) => {
            axios.get(`${url}/unres/${id}`).then((res) => {
                const ticket = res.data;
                resolve({
                    ...ticket,
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    // Delete tickets
    static deleteTicket(id) {
        return axios.delete(`${url}/${id}`);
    }
}

export default TicketService;