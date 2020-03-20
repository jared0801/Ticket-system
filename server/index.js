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
let client;


// Redirects users who aren't logged in
const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next()
    }
}

(async function() {
    // Uses a single connection for all 
    client = await mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true });
})().then(() => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    console.log(`Starting server in ${process.env.NODE_ENV} mode.`);

    const cookieExpirationDate = new Date();
    const cookieExpirationDays = 14;
    cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

    // Configuring express session & passport
    const sess = {
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ client, dbName: 'sessions' }),
        cookie: {
            expires: cookieExpirationDate,
        }
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
        done(null, user.id);
    });

    passport.deserializeUser(function(user_id, done) {
        /*User.findById(id, function(err, user) {
            done(err, user);
        });*/
        const users = client.db('ticket-system').collection('users');
        users.findOne({ _id: new mongodb.ObjectID(user_id) }, (err, user) => {
            if(err) {
                done(err, false);
            } else if(user) {
                const userDto = {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email
                }
                done(null, userDto);
            }
        });
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
                        const userDto = {
                            id: user._id,
                            username: user.username,
                            email: user.email
                        }
                        return done(null, userDto);
                    }
                    return done(null, false);
                });
            });
        }
    ));

    // API routes
    const tickets = require('./routes/api/tickets')(client, [authMiddleware]);
    const users = require('./routes/api/users')(client, [authMiddleware]);
    const projects = require('./routes/api/projects')(client, [authMiddleware]);
    const comments = require('./routes/api/comments')(client, [authMiddleware]);

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

