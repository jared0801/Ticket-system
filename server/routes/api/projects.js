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
    router.post('/', [
        body('title').not().isEmpty().withMessage("A title is required to create a project.").trim().escape(),
        body('description').not().isEmpty().withMessage("A description is required to create a project.").trim().escape(),
        body('userId').not().isEmpty().withMessage("A userId is required to create a project.").trim().escape()
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot create a project as the dev user." })
        }

        const projects = loadProjectsCollection();
        const newProject = {
            title: req.body.title,
            description: req.body.description,
            userId: new mongodb.ObjectID(req.body.userId),
            users: req.body.users,
            createdAt: new Date()
        }
        await projects.insertOne(newProject);
        res.status(201).send();
    });
    
    // Update a project
    router.post('/:id', [
        body('title').not().isEmpty().withMessage("A title is required to for a project at all times.").trim().escape(),
        body('description').not().isEmpty().withMessage("A description is required for a project at all times.").trim().escape(),
    ], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot update a project as the dev user." })
        }

        const projects = loadProjectsCollection();
        const query = { _id: new mongodb.ObjectID(req.params.id) };
        const newValues = { $set: { title: req.body.title,
                                    description: req.body.description
                                  }
        };
        if(!req.body.title) {
            res.status(400).send({ error: "A project is required to have a title."})
        } else {
            try {
                const project = await projects.findOne({ _id: new mongodb.ObjectID(req.params.id) });
                if(project.userId === req.user.id) {
                    projects.updateOne(query, newValues, function(err, obj) {
                        if(err) {
                            return res.status(400).json({ errors: err });
                        }
                        if(obj.modifiedCount === 1) res.send(req.body);
                        else res.status(400).send();
                    });
                } else {
                    res.status(403).json({ error: 'You can only update a project that you lead.' });
                }
            } catch(err) {
                res.status(400).send({ error: err.message });
            }
        }
    });
    
    // Delete a project
    router.delete('/:id', async (req, res) => {
        if(req.body.username.includes('dev1')) {
            return res.status(403).json({ error: "You cannot delete a project as the dev user." })
        }
        const projects = loadProjectsCollection();
        const tickets = loadTicketsCollection();
        try {
            const project = await projects.findOne({ _id: new mongodb.ObjectID(req.params.id) });
            if(project.userId === req.user.id) {
                await projects.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
                await tickets.deleteMany({ projId: new mongodb.ObjectID(req.params.id) });
                res.status(200).send();
            } else {
                res.status(403).json({ error: 'You can only delete a project that you lead.' });
            }
        } catch(err) {
            res.status(400).send({ error: err.message });
        }
    });
    
    function loadProjectsCollection() {
        return client.db('ticket-system').collection('projects');
    }
    
    function loadTicketsCollection() {
        return client.db('ticket-system').collection('tickets');
    }

    return router;
}

module.exports = loadRouter;