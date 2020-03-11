const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const tickets = require('./routes/api/tickets');

app.use('/api/tickets', tickets);

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if(err) return console.log(err);
    console.log(`Server started on port ${port}`)
});