const mysql = require('mysql');

// Connect MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ticket-system'
});

module.exports = db;