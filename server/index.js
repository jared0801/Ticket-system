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
// const mongoUrl = process.env.DB_PATH;


// Connect MySQL
const db = require('./connection');

// Use existing connection for session store
const sessionStore = new MySQLStore({}, db);

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("MySQL is connected.");
})

// Connect mongoose
/*mongoose.connect(
    mongoUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Mongoose is connected");
    }
);
const db = mongoose.connection;*/

// Middleware

// Redirects users who aren't logged in
/*const authMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next()
    }
}*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.SESS_SECRET));
app.use(cors({
    credentials: true,
    origin: "http://localhost:8080", // location of frontend app
}));


const cookieExpirationDate = new Date();
const cookieExpirationDays = 14;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

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

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);



app.use((req, res, next) => {
    //console.log(req.isAuthenticated());
    console.log(`${req.user ? req.user.username : 'null'} has accessed: ${req.originalUrl}`);
    next();
})
// API Routes
const users = require('./controllers/users.js');
app.use('/api/users', passport.initialize(), users);
const projects = require('./controllers/projects.js');
app.use('/api/projects', passport.initialize(), projects);
const tickets = require('./controllers/tickets.js');
app.use('/api/tickets', passport.initialize(), tickets);



// Static folder
// app.use(express.static(__dirname + '/public'));

//Forward routing to Vue
// app.get(/.*/, (req, res) => {
    // res.sendFile(__dirname + '/public/index.html');
// });*/


/*app.get('/createticketstable', (req, res) => {
    let sql = 'CREATE TABLE tickets(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("Table created!");
    })
})


app.get('/createuserstable', (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255), email VARCHAR(320) UNIQUE, password VARCHAR(255), PRIMARY KEY(id))';

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("User table created!");
    })
})

app.get('/createprojectstable', (req, res) => {
    let sql = 'CREATE TABLE projects(id int AUTO_INCREMENT, title VARCHAR(255), description TEXT, PRIMARY KEY(id))';

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("Projects table created!");
    })
})*/



/*
app.post('/createuser', (req, res) => {
    console.log(req.body);
    let user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }

    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, user, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("User successfully created!");
    })

});*/

/*
app.post('/createproject', (req, res) => {
    console.log(req.body);
    let project = {
        title: req.body.title,
        description: req.body.description,
        lead: req.body.lead
    }

    let sql = 'INSERT INTO projects SET ?';
    let query = db.query(sql, project, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("Project successfully created!");
    })

});*/

/*
app.get('/createprojectusersstable', (req, res) => {
    let sql = 'CREATE TABLE project_users(project_id int, user_id int, PRIMARY KEY(project_id, user_id))';

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("User project table created!");
    })
})
*/

app.get('/createticketuserstable', (req, res) => {
    let sql = 'CREATE TABLE ticket_users(ticket_id int, user_id int, PRIMARY KEY(ticket_id, user_id))';

    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send("User ticket table created!");
    })
})


// Start server

app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server has started on port ${port}...`);
});