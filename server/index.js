const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;


// Connect MySQL
const db = require('./connection');

// Use existing connection for session store
const sessionStore = new MySQLStore({}, db);

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("MySQL is connected.");
});

// Apply standard global middleware for parsing request body, cookies, and handling CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.SESS_SECRET));
app.use(cors({
    credentials: true,
    origin: "http://localhost:8080", // location of frontend app
}));

// Create an expiration date for login cookie
const cookieExpirationDate = new Date();
const cookieExpirationDays = 14;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

// Add the express session middleware
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        expires: cookieExpirationDate,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Add passport middleware & configuration
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Tells which endpoints have been accessed when in development mode
if(process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.user ? req.user.username : 'null'} has accessed: ${req.originalUrl}`);
        next();
    });
}


// API Routes
const users = require('./controllers/users.js');
app.use('/api/users', users);
const projects = require('./controllers/projects.js');
app.use('/api/projects', projects);
const tickets = require('./controllers/tickets.js');
app.use('/api/tickets', tickets);
const comments = require('./controllers/comments.js');
app.use('/api/comments', comments);


// Start server
app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server has started on port ${port}...`);
});