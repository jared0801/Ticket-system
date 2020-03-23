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
            if(doc.resolvedAt) groupedTickets.resolved.push(doc);
            else groupedTickets.unresolved.push(doc);
        })
        res.send(groupedTickets);
    });

    // Get a single ticket
    router.get('/ticket/:id', async (req, res) => {
        const tickets = loadTicketsCollection();
        res.send(await tickets.findOne({_id: new mongodb.ObjectID(req.params.id)}));
    });
    
    // Add a ticket
    router.post('/', async (req, res) => {
        const tickets = loadTicketsCollection();
        await tickets.insertOne({
            text: req.body.text,
            title: req.body.title,
            user: req.body.user,
            assignedUsers: req.body.assignedUsers,
            projId: new mongodb.ObjectID(req.body.projId),
            resolvedAt: req.body.resolvedAt,
            createdAt: new Date()
        });
        res.status(201).send();
    });
    
    // Update a ticket
    router.post('/:id', async (req, res) => {
        const tickets = loadTicketsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { title: req.body.title,
                                    text: req.body.text,
                                    assignedUsers: req.body.assignedUsers
                                  }
        }
        if(!req.title) {
            res.status(400).send({ message: 'A ticket is required to have a title.' });
        } else {
            tickets.updateOne(query, newValues, function(err, obj) {
                if(err) {
                    return res.status(400).json({ errors: err });
                }
                if(obj.modifiedCount === 1) res.send(req.body);
                else res.status(400).send();
            });
        }
    });

    // Resolve ticket
    router.get('/res/:id', async (req, res) => {
        // TODO: validate user has access to this ticket/project
        const tickets = loadTicketsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { resolvedAt: new Date() } };
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
        const newValues = { $set: { resolvedAt: '' } };
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
        const comments = loadCommentsCollection();
        try {
            await tickets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
            await comments.deleteMany({ ticket: new mongodb.ObjectID(req.params.id) });
            res.status(200).send();
        } catch(err) {
            res.status(400).send({ error: err });
        }
    });
    
    function loadTicketsCollection() {
        return client.db('ticket-system').collection('tickets');
    }
    
    function loadCommentsCollection() {
        return client.db('ticket-system').collection('comments');
    }

    return router;
}

module.exports = loadRouter;