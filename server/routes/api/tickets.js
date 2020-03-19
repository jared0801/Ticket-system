const express = require('express');
const mongodb = require('mongodb');


/**
   * Creates an api subroute
   * @method
   * @param {MongoDbClient} client - MongoDB client to connect to
   * @param {Function[]} middleware - Array of middleware functions to apply to all routes
   */
function loadRouter(client, middleware) {
    const router = express.Router();

    // Apply middleware to all subroutes
    if(middleware) {
        middleware.forEach(mw => router.use(mw));
    }
    
    // Get tickets
    router.get('/:projId', async (req, res) => {
        const tickets = await loadTicketsCollection();
        res.send(await tickets.find({ projId: new mongodb.ObjectID(req.params.projId) }).toArray());
    });

    // Get a single ticket
    router.get('/ticket/:id', async (req, res) => {
        const tickets = await loadTicketsCollection();
        res.send(await tickets.findOne({_id: new mongodb.ObjectID(req.params.id)}));
    });
    
    // Add ticket
    router.post('/', async (req, res) => {
        const tickets = await loadTicketsCollection();
        await tickets.insertOne({
            text: req.body.text,
            title: req.body.title,
            user: req.body.user,
            assignedUsers: req.body.assignedUsers,
            projId: new mongodb.ObjectID(req.body.projId),
            createdAt: new Date()
        });
        res.status(201).send();
    });
    
    // Remove ticket
    router.delete('/:id', async (req, res) => {
        const tickets = await loadTicketsCollection();
        await tickets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    
        res.status(200).send();
    });
    
    function loadTicketsCollection() {
        return client.db('ticket-system').collection('tickets');
    }

    return router;
}

module.exports = loadRouter;