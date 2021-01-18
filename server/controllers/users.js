const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../connection');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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

// Add a temp user
router.post('/register', [
    body('email').isEmail().withMessage("Not a valid email.").normalizeEmail().not().isEmpty().trim().escape(),
    body('username').isLength({ min: 4, max: 32 }).withMessage("Username length must be between 4 and 32 characters.").trim().escape(),
    body('password').isLength({ min: 6, max: 32 }).withMessage("Password length must be between 6 and 32 characters.").trim().escape()
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const buf = await crypto.randomBytes(20);
    const token = buf.toString('hex');

    
    const date = new Date();
    const expires = new Date(date.getTime() + (24*3600000) + date.getTimezoneOffset() * 60000); // Add a day and convert to UTC time

    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        confPasswordToken: token,
        confPasswordExpires: expires
    };
    console.log(newUser);
    let sql = 'INSERT INTO temp_users SET ?';
    db.query(sql, newUser, (err, result) => {
        if(err) {
            res.status(400).send("User already exists!");
        } else {
            try {
                // Send email with nodemailer
                const smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PW
                    }
                });
                const mailOptions = {
                    to: req.body.email,
                    from: process.env.GMAIL_USER,
                    subject: "TicketSystem Email Confirmation",
                    text: `You are receiving this email because you (or someone else) have created a TicketSystem account. Please navigate to the following link to complete registration:\n${process.env.FE_ORIGIN}/login/${token}\n\nIf you did not create this account, please ignore this email.`
                }
                smtpTransport.sendMail(mailOptions, function(err) {
                    if(err) {
                        throw err;
                    } else {
                        res.send("An email has been sent to " + req.body.email + " for further instructions.");
                    }
                });
                
            } catch(err) {
                res.status(400).json({ error: "Failed to confirm email address. Please try again later." });
            }
        }
    });
});


router.get('/login/:token', (req, res) => {
    let sql = `SELECT * FROM temp_users WHERE confPasswordToken = ? AND confPasswordExpires >= current_timestamp()`;
    db.query(sql, req.params.token, (err, result) => {
        if(err || result.length !== 1) {
            res.status(400).json({ error: "Password confirmation token is invalid or has expired." });
        } else {
            const user = result[0];
            // Insert into real user db
            console.log(user);
            const newUser = {
                username: user.username,
                email: user.email,
                password: user.password
            };
            let sql = 'INSERT INTO users SET ?';
            db.query(sql, newUser, (err, result) => {
                if(err) {
                    console.log(err);
                    res.status(400).json({ error: "User already found in database. Try resetting your password." });
                } else {
                    const sql = 'DELETE FROM temp_users WHERE ?';
                    db.query(sql, { email: user.email }, (err, result) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.send("Confirmation complete. You may now login.");
                        }
                    });
                }
            });
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

router.post('/forgot', [
    body('email').isEmail().withMessage("Not a valid email.").normalizeEmail().not().isEmpty().trim().escape(),
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(req.body.email.includes('demo@demo')) {
        return res.status(403).json({ error: "You cannot update the demo user." })
    }
    try {
        crypto.randomBytes(20, function(err, buf) {
            const token = buf.toString('hex');
            
            let sql = `SELECT id, username, email FROM users WHERE ?`;
            db.query(sql, {email: req.body.email }, (err, result) => {
                if(err || result.length < 1) {
                    res.status(400).json({ error: "That email isn't associated with a user." });
                } else {
                    console.log(result);
                    // Store password reset token
                    const user = result[0];
                    const date = new Date();
                    const expires = new Date(date.getTime() + 3600000 + date.getTimezoneOffset() * 60000);
                    console.log(date);
                    console.log(expires);
                    const resetToken = {
                        resetPasswordToken: token,
                        resetPasswordExpires: expires
                    };

                    const userId = {
                        id: user.id
                    }

                    let sql = 'UPDATE users SET ? WHERE ?';
                    db.query(sql, [resetToken, userId], (err, result) => {
                        if(err) {
                            throw err;
                        }
                        try {
                            // Send email with nodemailer
                            const smtpTransport = nodemailer.createTransport({
                                service: 'Gmail',
                                auth: {
                                    user: process.env.GMAIL_USER,
                                    pass: process.env.GMAIL_PW
                                }
                            });
                            const mailOptions = {
                                to: req.body.email,
                                from: process.env.GMAIL_USER,
                                subject: "TicketSystem Password Reset",
                                text: `You are receiving this email because you (or someone else) have requested a password reset for your TicketSystem account. Please navigate to the following link to complete the process:\n${process.env.FE_ORIGIN}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`
                            }
                            smtpTransport.sendMail(mailOptions, function(err) {
                                console.log('email sent');
                                console.log(err);
                                res.send("An email has been sent to " + req.body.email + " for further instructions.");
                            });
                            
                        } catch(err) {
                            res.status(400).json({ error: "Failed to send email. Please try again later." });
                        }
                    });
                }

            });
        })
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
});

router.get('/reset/:token', (req, res) => {
    let sql = `SELECT id, username, email FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires >= current_timestamp()`;
    db.query(sql, req.params.token, (err, result) => {
        console.log(result);
        console.log(req.params.token);
        if(err || result.length !== 1) {
            res.status(400).json({ error: "Password reset token is invalid or has expired." })
        } else {
            res.send(result[0]);
        }

    });
});

router.post('/reset/:token', (req, res) => {
    let sql = `SELECT id, username, email FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires >= current_timestamp()`;
    db.query(sql, req.params.token, async (err, result) => {
        if(err) {
            res.status(400).json({ error: "Password reset token is invalid or has expired." })
        } else {
            if(req.body.password === req.body.confPassword) {
                // Update password and reset token fields
                const user = result[0];
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                const newPass = {
                    password: hashedPassword,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined
                };
                const userId = {
                    id: user.id
                }
                let sql = 'UPDATE users SET ? WHERE ?';
                db.query(sql, [newPass, userId], (err, result) => {
                    if(err) {
                        res.status(400).send({ error: "That username is already in use."});
                    } else {

                        // Send confirmation email
                        const smtpTransport = nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: process.env.GMAIL_USER,
                                pass: process.env.GMAIL_PW
                            }
                        });
                        const mailOptions = {
                            to: user.email,
                            from: process.env.GMAIL_USER,
                            subject: "Your TicketSystem Password has Changed",
                            text: `This is a confirmation that the password for your TicketSystem account has changed.`
                        }
                        smtpTransport.sendMail(mailOptions, (err) => {
                            if(err) {
                                res.status(400).json({ error: err.message });
                            } else {
                                res.status(200).send("Password successfully updated!");
                            }
                        })
                    }
                });
            } else {
                res.status(400).send({ error: "Passwords do not match." });
            }
        }

    });

});


// Update a user profile
router.post('/update', authMiddleware, [
    body('username').isLength({ min: 4, max: 32 }).withMessage("Username length must be between 4 and 32 characters.").trim().escape(),
], async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if(req.user.username.includes('demo')) {
        return res.status(403).json({ error: "You cannot update the demo user." })
    }
    try {

        const newUser = {
            username: req.body.username
        };
        const userId = {
            id: req.user.id
        }
    
        let sql = 'UPDATE users SET ? WHERE ?';
        db.query(sql, [newUser, userId], (err, result) => {
            if(err) {
                res.status(400).send({ error: "That username is already in use."});
            } else {
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