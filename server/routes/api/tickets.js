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
        const tickets = loadTicketsCollection();
        const groupedTickets = { resolved: [], unresolved: [] };
        const ticketArr = await tickets.find({ projId: new mongodb.ObjectID(req.params.projId) }).toArray();
        
        ticketArr.forEach(doc => {
            if(doc.resolved) groupedTickets.resolved.push(doc);
            else groupedTickets.unresolved.push(doc);
        })
        res.send(groupedTickets);
    });

    // Get a single ticket
    router.get('/ticket/:id', async (req, res) => {
        const tickets = loadTicketsCollection();
        res.send(await tickets.findOne({_id: new mongodb.ObjectID(req.params.id)}));
    });
    
    // Add ticket
    router.post('/', async (req, res) => {
        const tickets = loadTicketsCollection();
        await tickets.insertOne({
            text: req.body.text,
            title: req.body.title,
            user: req.body.user,
            assignedUsers: req.body.assignedUsers,
            projId: new mongodb.ObjectID(req.body.projId),
            resolved: req.body.resolved,
            createdAt: new Date()
        });
        res.status(201).send();
    });

    // Resolve ticket
    router.get('/res/:id', async (req, res) => {
        // TODO: validate user has access to this ticket/project
        const tickets = loadTicketsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { resolved: true } };
        tickets.updateOne(query, newValues, function(err, obj) {
            if(err) {
                console.log(err);
                return res.status(400).json({ errors: err });
            }
            if(obj.modifiedCount === 1) res.send(req.body);
            else res.status(400).send();
        });
    })

    // Unresolve ticket
    router.get('/unres/:id', async (req, res) => {
        // TODO: validate user has access to this ticket/project
        const tickets = loadTicketsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { resolved: false } };
        tickets.updateOne(query, newValues, function(err, obj) {
            if(err) {
                console.log(err);
                return res.status(400).json({ errors: err });
            }
            if(obj.modifiedCount === 1) res.send(req.body);
            else res.status(400).send();
        });
    })
    
    // Remove ticket
    router.delete('/:id', async (req, res) => {
        const tickets = loadTicketsCollection();
        await tickets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    
        res.status(200).send();
    });
    
    function loadTicketsCollection() {
        return client.db('ticket-system').collection('tickets');
    }

    return router;
}

module.exports = loadRouter;