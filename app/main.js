const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const rideRequestRoutes = require('./routes/ride-requests');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ride-requests', rideRequestRoutes);

app.get('/', (req, res) => {
    res.send('Carpool App Backend API is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
