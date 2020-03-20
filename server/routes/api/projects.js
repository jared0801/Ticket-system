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
    
    // Get list of all projects
    router.get('/', async (req, res) => {
        const projects = loadProjectsCollection();
        res.send(await projects.find({}).toArray());
    });

    // Get a single project
    router.get('/:id', async (req, res) => {
        const projects = loadProjectsCollection();
        res.send(await projects.findOne({_id: new mongodb.ObjectID(req.params.id)}));
    });
    
    // Add a project
    router.post('/', async (req, res) => {
        const projects = loadProjectsCollection();
        const newProject = {
            title: req.body.title,
            description: req.body.description,
            lead: req.body.lead,
            users: req.body.users,
            createdAt: new Date()
        }
        if(!newProject.title || !newProject.lead) {
            res.status(400).send({ message: "A title and lead are required to create a new project." });
        } else {
            await projects.insertOne(newProject);
            res.status(201).send();
        }
    });
    
    // Delete a project
    router.delete('/:id', async (req, res) => {
        const projects = loadProjectsCollection();
        await projects.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
    
        res.status(200).send();
    });
    
    function loadProjectsCollection() {
        return client.db('ticket-system').collection('projects');
    }

    return router;
}

module.exports = loadRouter;