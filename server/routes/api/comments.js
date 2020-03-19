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
        //middleware.forEach(mw => router.use(mw));
    }

    // Get a single comment
    router.get('/:id', async (req, res) => {
        const comments = await loadCommentsCollection();
        res.send(await comments.find({ticket: new mongodb.ObjectID(req.params.id)}).toArray());
    });
    
    // Add a comment
    router.post('/', async (req, res) => {
        const comments = await loadCommentsCollection();
        const newComment = {
            text: req.body.text,
            user: req.body.user,
            ticket: new mongodb.ObjectID(req.body.ticket),
            createdAt: new Date()
        }
        if(!newComment.text || !newComment.user) {
            res.status(400).send({ message: "Text and a user are required to create a new comment." });
        } else {
            await comments.insertOne(newComment);
            res.status(201).send();
        }
        
    });
    
    // Delete a comment
    router.delete('/:id', async (req, res) => {
        const comments = await loadCommentsCollection();
        await comments.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    
        res.status(200).send();
    });
    
    function loadCommentsCollection() {
        return client.db('ticket-system').collection('comments');
    }

    return router;
}

module.exports = loadRouter;