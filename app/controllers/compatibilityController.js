const express = require('express');
const axios = require('axios');
const { sql } = require('../db');  

const COMPATIBILITY_API_URL = 'https://ananyaprakashvt-app--5000.prod1a.defang.dev/compatibility';

const getCompatibility = async (req, res) => {
    const { passenger_id, driver_ids } = req.body;

    if (!passenger_id || !driver_ids || !Array.isArray(driver_ids)) {
        return res.status(400).json({ msg: 'Invalid input. Provide passenger_id and a list of driver_ids.' });
    }

    try {
        const payload = {
            target_user_id: passenger_id,
            user_list: driver_ids
        };

        const response = await axios.post(COMPATIBILITY_API_URL, payload);

        if (response.data && Array.isArray(response.data)) {
            const compatibilityScores = response.data;
            console.log(compatibilityScores);
            for (const driverScore of compatibilityScores) {
                const driver_id = driverScore.user_id;
                const score = driverScore.similarity_score;

                await sql.query`
                    IF EXISTS (SELECT * FROM Compatibility WHERE passenger_id = ${passenger_id} AND driver_id = ${driver_id})
                    BEGIN
                        UPDATE Compatibility SET score = ${score} WHERE passenger_id = ${passenger_id} AND driver_id = ${driver_id}
                    END
                    ELSE
                    BEGIN
                        INSERT INTO Compatibility (passenger_id, driver_id, score) VALUES (${passenger_id}, ${driver_id}, ${score})
                    END
                `;
            }

            res.json({ msg: 'Compatibility scores updated successfully' });
        } else {
            return res.status(500).json({ msg: 'Invalid response from compatibility API' });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {getCompatibility};
