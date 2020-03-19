const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require('mongodb');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
require('dotenv').config();

const mongoUrl = process.env.DB_PATH;

const app = express();

app.use(express.json());
app.use(cors());

console.log(`Starting server in ${process.env.NODE_ENV} mode.`);

let client;

(async function() {
    // Uses a single connection for all 
    client = await mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true });
})().then(() => {

    const authMiddleware = (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            return next()
        }
    }

    // Configuring express session & passport
    const sess = {
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ client, dbName: 'sessions' }),
        cookie: {}
    }

    if(process.env.NODE_ENV === 'production') {
        // Configure session for production
        //app.set('trust proxy', 1);
        //sess.cookie.secure = true;
    }

    app.use(session(sess));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        /*User.findById(id, function(err, user) {
            done(err, user);
        });*/
        done(null, user);
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            // Load collection
            const userCollection = client.db('ticket-system').collection('users');
            // Find user
            userCollection.findOne({ username }, (err, user) => {
                if(err) return done(err);
                if(!user) {
                    return done(null, false);
                }
                // Compare hashed password
                bcrypt.compare(password, user.password, (err, response) => {
                    if(err) return done(err);
                    if(response === true) {
                        return done(null, { 
                            user_id: user._id,
                            username: user.username,
                            email: user.email
                        });
                    }
                    return done(null, false);
                });
            });
        }
    ));

    // API routes
    const tickets = require('./routes/api/tickets')(client, [authMiddleware]);
    const users = require('./routes/api/users')(client);
    const projects = require('./routes/api/projects')(client);
    const comments = require('./routes/api/comments')(client);

    app.use('/api/tickets', tickets);
    app.use('/api/users', users);
    app.use('/api/projects', projects);
    app.use('/api/comments', comments);


    // Static folder
    app.use(express.static(__dirname + '/public'));

    //Forward routing to Vue
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });

    const port = process.env.PORT || 5000;

    app.listen(port, (err) => {
        if(err) return console.log(err);
        console.log(`Server started on port ${port}`)
    });

});

