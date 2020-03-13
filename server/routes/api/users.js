const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

require('dotenv').config();

const saltRounds = 10;

const router = express.Router();
const mongoUrl = process.env.DB_PATH;

// Get a single user
router.get('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    res.send(await users.findOne({_id: new mongodb.ObjectID(req.params.id)}));
})

// Add a user
router.post('/', [
    body('email').isEmail().withMessage("Not a valid email.").normalizeEmail().not().isEmpty().trim().escape(),
    body('username').isLength({ min: 4, max: 32 }).withMessage("Username length must be between 4 and 32 characters.").trim().escape(),
    body('password').isLength({ min: 6, max: 32 }).withMessage("Password length must be between 6 and 32 characters.").trim().escape()
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const users = await loadUsersCollection();
    bcrypt.hash(user.password, saltRounds, async (err, hash) => {
        if(err) throw err;
        user.password = hash;
        try {
            await users.insertOne({
                ...user
            })
            res.status(201).send();
        } catch(e) {
            res.status(409).json({ errors: e });
        }
    })
    /*await users.insertOne({
        text: req.body.text,
        title: req.body.title,
        createdAt: new Date()
    });
    res.status(201).send();*/
})

// Remove a user
router.delete('/:id', async (req, res) => {
    const users = await loadUsersCollection();
    await users.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

    res.status(200).send();
})

async function loadUsersCollection() {
    const client = await mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true});

    return client.db('ticket-system').collection('users');
}

module.exports = router;