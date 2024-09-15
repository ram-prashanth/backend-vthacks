const { sql } = require('../db');

const requestRide = async (req, res) => {
    const { passenger_id, trip_id } = req.body;
    try {
        await sql.query`INSERT INTO Bookings (passenger_id, trip_id, status) VALUES (${passenger_id}, ${trip_id}, 'pending')`;
        res.json({ msg: 'Ride requested successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getRideStatus = async (req, res) => {
    const rideId = req.params.rideId;
    try {
        let result = await sql.query`SELECT * FROM Bookings WHERE booking_id = ${rideId}`;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { requestRide, getRideStatus };
