const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

app.all('/', (req, res) => {
    res.send({
        "path": req.path,
        "method": req.method,
        "headers": req.headers,
        "args": req.query,
        "body": req.body
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
