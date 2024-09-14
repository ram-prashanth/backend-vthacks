const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/', async (req, res) => {
    const { trip_status, trip_date, trip_time, source, destination, passengers, vehicle_number, trip_verified, safety_count, trip_type } = req.body;

    const query = `
        INSERT INTO [dbo].[Trips] (trip_status, trip_date, trip_time, source, destination, passengers, vehicle_number, trip_verified, safety_count, trip_type)
        VALUES (@trip_status, @trip_date, @trip_time, @source, @destination, @passengers, @vehicle_number, @trip_verified, @safety_count, @trip_type)
    `;

    try {
        const pool = await sql.connect();
        await pool.request()
            .input('trip_status', sql.NVarChar, trip_status)
            .input('trip_date', sql.Date, trip_date)
            .input('trip_time', sql.Time, trip_time)
            .input('source', sql.NVarChar, source)
            .input('destination', sql.NVarChar, destination)
            .input('passengers', sql.NVarChar, JSON.stringify(passengers)) // store passengers as JSON string
            .input('vehicle_number', sql.NVarChar, vehicle_number)
            .input('trip_verified', sql.Bit, trip_verified)
            .input('safety_count', sql.Int, safety_count)
            .input('trip_type', sql.NVarChar, trip_type)
            .query(query);
        
        res.status(201).send('Trip created successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// READ (get) a single trip by ID
router.get('/:id', async (req, res) => {
    const tripId = req.params.id;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('tripId', sql.Int, tripId)
            .query('SELECT * FROM [dbo].[Trips] WHERE trip_id = @tripId');

        if (result.recordset.length === 0) {
            return res.status(404).send('Trip not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    const tripId = req.params.id;
    const { trip_status, trip_date, trip_time, source, destination, passengers, vehicle_number, trip_verified, safety_count, trip_type } = req.body;

    const query = `
        UPDATE [dbo].[Trips]
        SET trip_status = @trip_status, trip_date = @trip_date, trip_time = @trip_time, 
            source = @source, destination = @destination, passengers = @passengers,
            vehicle_number = @vehicle_number, trip_verified = @trip_verified, 
            safety_count = @safety_count, trip_type = @trip_type
        WHERE trip_id = @tripId
    `;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('tripId', sql.Int, tripId)
            .input('trip_status', sql.NVarChar, trip_status)
            .input('trip_date', sql.Date, trip_date)
            .input('trip_time', sql.Time, trip_time)
            .input('source', sql.NVarChar, source)
            .input('destination', sql.NVarChar, destination)
            .input('passengers', sql.NVarChar, JSON.stringify(passengers))
            .input('vehicle_number', sql.NVarChar, vehicle_number)
            .input('trip_verified', sql.Bit, trip_verified)
            .input('safety_count', sql.Int, safety_count)
            .input('trip_type', sql.NVarChar, trip_type)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Trip not found');
        }

        res.send('Trip updated successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    const tripId = req.params.id;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('tripId', sql.Int, tripId)
            .query('DELETE FROM [dbo].[Trips] WHERE trip_id = @tripId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Trip not found');
        }

        res.send('Trip deleted successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
