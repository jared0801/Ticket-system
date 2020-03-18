const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator');

const saltRounds = 10;

function loadRouter(client) {
    const router = express.Router();

    // Login a user
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if(err) return next(err);
            if(!user) return res.status(401).json(info);
            req.session.user = user;
            res.json(user);
        })(req, res, next);
    });

    // Validate a user session
    router.get('/user', (req, res) => {
        res.send(req.session.user);
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

        const users = await loadUsersCollection();
        bcrypt.hash(user.password, saltRounds, async (err, hash) => {
            if(err) throw err;
            user.password = hash;
            await users.insertOne({
                ...user
            }).catch((e) => {
                if(e.errmsg.includes("duplicate"))
                    return res.status(409).json({ errors: e });
            }).then((newUser) => {
                req.login(newUser.insertedId, (err) => {
                    res.status(201).send();
                });
            })
        })
    });

    function loadUsersCollection() {
        return client.db('ticket-system').collection('users');
    }

    return router;
}


module.exports = loadRouter;