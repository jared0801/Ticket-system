const express = require('express');
const mongodb = require('mongodb');
require('dotenv').config();

const router = express.Router();
const mongoUrl = process.env.DB_PATH;

// Get tickets
router.get('/', async (req, res) => {
    const tickets = await loadTicketsCollection();
    res.send(await tickets.find({}).toArray());
})
// Get a single ticket
router.get('/:id', async (req, res) => {
    const tickets = await loadTicketsCollection();
    res.send(await tickets.findOne({_id: new mongodb.ObjectID(req.params.id)}));
})

// Add ticket
router.post('/', async (req, res) => {
    const tickets = await loadTicketsCollection();
    await tickets.insertOne({
        text: req.body.text,
        title: req.body.title,
        createdAt: new Date()
    });
    res.status(201).send();
})

// Remove ticket
router.delete('/:id', async (req, res) => {
    const tickets = await loadTicketsCollection();
    await tickets.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

    res.status(200).send();
})

async function loadTicketsCollection() {
    const client = await mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true});

    return client.db('ticket-system').collection('tickets');
}

module.exports = router;