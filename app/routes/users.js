const express = require('express');
const router = express.Router();
const { sql } = require('../db');

router.post('/', async (req, res) => {
    const { name, password, hokie_id, phone_number, email_id, vt_clubs, languages, music_genre, member_type } = req.body;
    
    const query = `
        INSERT INTO [dbo].[User] (name, password, hokie_id, phone_number, email_id, vt_clubs, languages, music_genre, member_type)
        VALUES (@name, @password, @hokie_id, @phone_number, @email_id, @vt_clubs, @languages, @music_genre, @member_type)
    `;
    
    try {
        const pool = await sql.connect();
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('password', sql.NVarChar, password)
            .input('hokie_id', sql.NVarChar, hokie_id)
            .input('phone_number', sql.NVarChar, phone_number)
            .input('email_id', sql.NVarChar, email_id)
            .input('vt_clubs', sql.NVarChar, vt_clubs)
            .input('languages', sql.NVarChar, languages)
            .input('music_genre', sql.NVarChar, music_genre)
            .input('member_type', sql.NVarChar, member_type)
            .query(query);
        
        res.status(201).send('User created successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT * FROM [dbo].[User] WHERE user_id = @userId');
        
        if (result.recordset.length === 0) {
            return res.status(404).send('User not found');
        }
        
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, phone_number, email_id, vt_clubs, languages, music_genre, member_type } = req.body;

    const query = `
        UPDATE [dbo].[User]
        SET name = @name, phone_number = @phone_number, email_id = @email_id, vt_clubs = @vt_clubs, 
            languages = @languages, music_genre = @music_genre, member_type = @member_type
        WHERE user_id = @userId
    `;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('name', sql.NVarChar, name)
            .input('phone_number', sql.NVarChar, phone_number)
            .input('email_id', sql.NVarChar, email_id)
            .input('vt_clubs', sql.NVarChar, vt_clubs)
            .input('languages', sql.NVarChar, languages)
            .input('music_genre', sql.NVarChar, music_genre)
            .input('member_type', sql.NVarChar, member_type)
            .query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('User not found');
        }

        res.send('User updated successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const pool = await sql.connect();
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('DELETE FROM [dbo].[User] WHERE user_id = @userId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
