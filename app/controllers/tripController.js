const { sql } = require('../db');

const createRide = async (req, res) => {
    const { driver_id, source, destination, date } = req.body;
    try {
        await sql.query`INSERT INTO Trips (driver_id, source, destination, date, trip_status) VALUES (${driver_id}, ${source}, ${destination}, ${date}, 'offered')`;
        res.json({ msg: 'Ride created successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const findRide = async (req, res) => {
    const { passenger_id, source, destination, date } = req.body;
    try {
        let passengerResult = await sql.query`SELECT * FROM Users WHERE user_id = ${passenger_id}`;
        const passenger = passengerResult.recordset[0];

        let tripResult = await sql.query`
            SELECT * FROM Trips 
            JOIN Users ON Trips.driver_id = Users.user_id 
            WHERE Trips.source = ${source} AND Trips.destination = ${destination} AND Trips.date = ${date} AND trip_status = 'offered'`;

        const trips = tripResult.recordset;

        // Add compatibility calculation
        const tripsWithCompatibility = trips.map((trip) => {
            const driver = {
                music_genre: trip.music_genre,
                languages: trip.languages,
                vt_clubs: trip.vt_clubs,
                pronouns: trip.pronouns,
            };

            let score = 0;
            if (passenger.music_genre === driver.music_genre) score += 25;
            if (passenger.languages === driver.languages) score += 25;
            if (passenger.vt_clubs === driver.vt_clubs) score += 25;
            if (passenger.pronouns === driver.pronouns) score += 25;

            return { ...trip, compatibilityScore: score };
        });

        res.json(tripsWithCompatibility);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getUpcomingTripsForPassenger = async (req, res) => {
    const userId = req.params.userId;
    try {
        let result = await sql.query`SELECT * FROM Trips WHERE passenger_id = ${userId} AND trip_status IN ('requested', 'scheduled')`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { createRide, findRide, getUpcomingTripsForPassenger };
