const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../connection');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const saltRounds = 10;

const router = express.Router();


/* Public Routes - accessible to all */

// Login a user
router.post('/login', passport.authenticate('local'), (req, res) => {
    req.login(req.user, err => {
        if(err) res.status(400).send(err);
        res.json(req.user);
    })
});

// Logout a user
router.get('/logout', authMiddleware, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).send("Logout successful!");
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
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    };

    let sql = 'INSERT INTO users SET ?';
    db.query(sql, newUser, (err, result) => {
        if(err) {
            res.send("User already exists!");
        } else {
            //console.log(result);
            res.status(201).send("User successfully created!");
        }
    });
});


/* Private Routes - with middleware applied */
/*
if(middleware) {
    middleware.forEach(mw => router.use(mw));
}*/

// Returns a list of all usernames
router.get('/', authMiddleware, async (req, res) => {
    let sql = 'SELECT username, id FROM users';
    db.query(sql, (err, result) => {
        if(err) throw err;
        //result = result.map(r => r.username);
        res.send(result);
    })
    /*User.find({}, async (err, doc) => {
        if(err) throw err;
        if(doc) {
            const userArray = doc.map(user => user.username);
            res.json(userArray);
        }
    });*/
});
// Return a specific user
router.get('/user/:id', authMiddleware, async (req, res) => {
    let info = {
        id: req.params.id
    }
    let sql = `SELECT id, username, email FROM users WHERE ?`;
    db.query(sql, info, (err, result) => {
        if(err) {
            throw err;
        } else {
            res.send(result[0]);
        }

    });
});


// Update a user profile
router.post('/update', authMiddleware, [
    body('email').isEmail().withMessage("Not a valid email.").normalizeEmail().not().isEmpty().trim().escape(),
    body('username').isLength({ min: 4, max: 32 }).withMessage("Username length must be between 4 and 32 characters.").trim().escape(),
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if(req.body.username.includes('dev1')) {
        return res.status(403).json({ error: "You cannot update the dev user." })
    }
    try {

        const newUser = {
            username: req.body.username,
            email: req.body.email,
        };
        const userId = {
            id: req.user.id
        }
    
        let sql = 'UPDATE users SET ? WHERE ?';
        db.query(sql, [newUser, userId], (err, result) => {
            if(err) {
                res.send(err);
            } else {
                console.log(result);
                res.status(200).send("User successfully updated!");
            }
        });

        
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
});

// Validate a user session
router.get('/user', authMiddleware, (req, res) => {
    res.send(req.user);
});
    
module.exports = router;