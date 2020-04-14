const express = require('express');
const mongodb = require('mongodb');
const { body, validationResult } = require('express-validator');

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
        //const ticketArr = await tickets.find({ projId: new mongodb.ObjectID(req.params.projId) }).toArray();
        const ticketArr = await tickets.aggregate([ { $match: { 'projId': new mongodb.ObjectID(req.params.projId) } }, // Find tickets based on projId in URL
                                                    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }, // Lookup users in User collection with userId foreign key
                                                    { $unwind: '$user' }, // Only one user will match, so user should refer to an object rather than an array of objects
                                                    { $project: { user: { password: 0, email: 0 }, userId: 0 } } // Remove the password and email fields from user
                                                ]).toArray();

        ticketArr.forEach(doc => {
            if(doc.resolvedAt) groupedTickets.resolved.push(doc);
            else groupedTickets.unresolved.push(doc);
        })
        res.send(groupedTickets);
    });

    // Get a single ticket
    router.get('/ticket/:id', async (req, res) => {
        const tickets = loadTicketsCollection();
        //const ticket = await tickets.findOne({_id: new mongodb.ObjectID(req.params.id)});
        const ticket = await tickets.aggregate([ { $match: { '_id': new mongodb.ObjectID(req.params.id) } }, // Find ticket based on id in URL
                                                 { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } }, // Lookup users in User collection with userId foreign key
                                                 { $unwind: '$user' }, // Only one user will match, so user should refer to an object rather than an array of objects
                                                 { $project: { user: { password: 0, email: 0 }, userId: 0 } } // Remove the password and email fields from user
                                            ]).toArray();
        res.send(ticket[0]);
    });
    
    // Add a ticket
    router.post('/', [
        body('title').not().isEmpty().withMessage("A title is required to create a ticket.").trim().escape(),
        body('text').not().isEmpty().withMessage("Text is required to create a ticket.").trim().escape(),
        body('userId').not().isEmpty().withMessage("A userId is required to create a ticket.").trim().escape(),
        body('projId').not().isEmpty().withMessage("A projId is required to create a ticket.").trim().escape(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot create a ticket as the dev user." })
        }

        const tickets = loadTicketsCollection();
        await tickets.insertOne({
            text: req.body.text,
            title: req.body.title,
            userId: new mongodb.ObjectID(req.body.userId),
            assignedUsers: req.body.assignedUsers,
            projId: new mongodb.ObjectID(req.body.projId),
            resolvedAt: req.body.resolvedAt,
            createdAt: new Date()
        });
        res.status(201).send();
    });
    
    // Update a ticket
    router.post('/:id', [
        body('title').not().isEmpty().withMessage("A title is required to create a ticket.").trim().escape(),
        body('text').not().isEmpty().withMessage("Text is required to create a ticket.").trim().escape(),
    ],async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot update a ticket as the dev user." })
        }

        const tickets = loadTicketsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { title: req.body.title,
                                    text: req.body.text,
                                    assignedUsers: req.body.assignedUsers
                                  }
        }
        if(!req.body.title) {
            res.status(400).send({ error: 'A ticket is required to have a title.' });
        } else {
            try {
                const ticket = await tickets.findOne({ _id: new mongodb.ObjectID(req.params.id) });
                if(ticket.userId === req.user.id) {
                    tickets.updateOne(query, newValues, function(err, obj) {
                        if(err) {
                            return res.status(400).json({ errors: err });
                        }
                        if(obj.modifiedCount === 1) res.send(req.body);
                        else res.status(400).send();
                    });
                } else {
                    res.status(403).json({ error: 'You can only update your own tickets.' });
                }
            } catch(err) {
                return res.status(400).json({ error: err.message });
            }
        }
    });

    // Resolve ticket
    router.get('/res/:id', async (req, res) => {
        // TODO: validate user has access to this ticket/project
        if(req.user.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot resolve a ticket as the dev user." })
        }
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
        if(req.user.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot unresolve a ticket as the dev user." })
        }
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
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot delete a ticket as the dev user." })
        }
        const tickets = loadTicketsCollection();
        const comments = loadCommentsCollection();
        try {
            const ticket = await tickets.findOne({ _id: new mongodb.ObjectID(req.params.id) });
            if(ticket.userId === req.user.id) {
                await tickets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
                await comments.deleteMany({ ticket: new mongodb.ObjectID(req.params.id) });
                res.status(200).send();
            } else {
                res.status(403).json({ error: 'You can only delete your own tickets.' });
            }
        } catch(err) {
            return res.status(400).json({ error: err.message });
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