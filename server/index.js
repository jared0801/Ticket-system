const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const tickets = require('./routes/api/tickets');
const users = require('./routes/api/users');

app.use('/api/tickets', tickets);
app.use('/api/users', users);

if(process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express.static(__dirname + '/public'));

    //SPA?
    app.get(/.*/, (req, res) => res.sendFile(__dirname + 'public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server started on port ${port}`)
});