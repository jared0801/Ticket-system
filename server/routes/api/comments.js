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

    // Apply middleware
    if(middleware) {
        middleware.forEach(mw => router.use(mw));
    }

    // Get a single comment
    router.get('/:id', async (req, res) => {
        const comments = loadCommentsCollection();
        res.send(await comments.find({ticket: new mongodb.ObjectID(req.params.id)}).toArray());
    });
    
    // Add a comment
    router.post('/', async (req, res) => {
        const comments = loadCommentsCollection();
        const newComment = {
            text: req.body.text,
            userId: req.body.userId,
            ticket: new mongodb.ObjectID(req.body.ticket),
            createdAt: new Date()
        }
        if(!newComment.text || !newComment.userId) {
            res.status(400).send({ error: "Text and a userId are required to create a new comment." });
        } else {
            await comments.insertOne(newComment);
            res.status(201).send();
        }
        
    });
    
    // Update a comment
    router.post('/:id', async (req, res) => {
        const comments = loadCommentsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { text: req.body.text, lastEdit: new Date() }};
        if(!req.body.text) {
            return res.status(400).send({ error: 'A comment cannot be empty.' });
        } else {
            try {
                const comment = await comments.findOne(query);
                if(comment.userId.toString() === req.user.id) {
                    comments.updateOne(query, newValues, function(err, obj) {
                        if(err) {
                            return res.status(400).json({ error: err });
                        }
                        if(obj.modifiedCount === 1) res.send(req.body);
                        else res.status(400).send();
                    });
                } else {
                    res.status(403).json({ error: 'You can only edit your own comment.' });
                }
            } catch(err) {
                return res.status(400).json({error: err.message});
            }
        }
    });
    
    // Delete a comment
    router.delete('/:id', async (req, res) => {
        const comments = loadCommentsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        try {
            const comment = await comments.findOne(query);
            console.log(comment);
            if(comment.userId.toString() === req.user.id) {
                await comments.deleteOne(query);
                res.status(200).send();
            } else {
                res.status(403).json({ error: 'You can only delete your own comment.' });
            }
        } catch(err) {
            return res.status(400).json({ error: err.message });
        }
    });
    
    function loadCommentsCollection() {
        return client.db('ticket-system').collection('comments');
    }

    return router;
}

module.exports = loadRouter;