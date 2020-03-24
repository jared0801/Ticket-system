const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const mongodb = require('mongodb');
const { body, validationResult } = require('express-validator');

const saltRounds = 10;

function loadRouter(client, middleware) {
    const router = express.Router();
    
    /* Protected Routes - use all middleware passed to this router */

    // Returns a list of all usernames
    router.get('/', (req, res, next) => {
        if(middleware) {
            middleware.forEach(mw => mw(req, res, next));
        } else {
            next();
        }
    }, async (req, res) => {
        const users = loadUsersCollection();
        let userArray = await users.find({}).toArray();
        userArray = userArray.map(user => user.username); // IMPORTANT: Only pass the username
        res.send(userArray);
    });

    // Validate a user session
    router.get('/user', (req, res, next) => {
        if(middleware) {
            middleware.forEach(mw => mw(req, res, next));
        } else {
            next();
        }
    }, (req, res) => {
        res.send(req.user);
    });

    // Update a user profile
    router.post('/update', (req, res, next) => {
        if(middleware) {
            middleware.forEach(mw => mw(req, res, next));
        } else {
            next();
        }
    }, async (req, res) => {
        if(!req.body.username || !req.body.email) {
            res.status(400).send({ error: 'A username and an email are required at all times.' });
        } else {
            try {
                const users = loadUsersCollection();
                const query = { _id: new mongodb.ObjectID(req.body.id) };
                const newValues = { $set: {username: req.body.username, email: req.body.email} };

                const user = await users.findOne(query);
                if(user._id.toString() === req.user.id) {
                    users.updateOne(query, newValues, function(err, obj) {
                        if(err) {
                            if(err.errmsg.includes("duplicate"))
                                return res.status(409).json({ error: 'Another user has already taken this username or email.' });
                        }
                        if(obj.modifiedCount === 1) res.send(req.body);
                        else res.status(400).send();
                    });
                } else {
                    res.status(403).json({ error: 'You can only update your own profile.' });
                }
            } catch(err) {
                
            }
        }
    });


    /* Public Routes - accessible to all */

    // Login a user
    router.post('/login', passport.authenticate('local'), (req, res) => {
        req.login(req.user, err => {
            if(err) res.status(400).send(err);
            res.json(req.user);
        })
    });
    
    // Logout a user
    router.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    // Add a user
    router.post('/register', [
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

        const users = loadUsersCollection();
        bcrypt.hash(user.password, saltRounds, async (err, hash) => {
            if(err) throw err;
            user.password = hash;
            await users.insertOne({
                ...user
            }).catch((e) => {
                if(e.errmsg.includes("duplicate"))
                    return res.status(409).json({ errors: e });
            }).then(() => {
                res.status(201).send();
            })
        })
    });

    function loadUsersCollection() {
        return client.db('ticket-system').collection('users');
    }

    return router;
}


module.exports = loadRouter;