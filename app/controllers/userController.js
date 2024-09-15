const { sql } = require('../db');

// User registration: No password hashing, plain text passwords stored
const registerUser = async (req, res) => {
    const {
        name,
        email_id,
        password,
        hokie_id,
        phone_no,
        vt_clubs,        
        languages,      
        music_genre,     
        member_type,    
        license_no,      
        pronouns,        
        convo_level     
    } = req.body;

    try {
        // Check if the user already exists by email_id
        let result = await sql.query`SELECT * FROM Users WHERE email_id = ${email_id}`;
        if (result.recordset.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Insert the user into the database with all fields
        await sql.query`
            INSERT INTO Users (name, password, email_id, hokie_id, phone_no, vt_clubs, languages, music_genre, member_type, license_no, pronouns, convo_level)
            VALUES (${name}, ${password}, ${email_id}, ${hokie_id}, ${phone_no}, ${vt_clubs}, ${languages}, ${music_genre}, ${member_type}, ${license_no}, ${pronouns}, ${convo_level})`;

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);  // Log the error for debugging
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email_id, password } = req.body;
    try {
       
        let result = await sql.query`SELECT * FROM Users WHERE email_id = ${email_id}`;
        if (result.recordset.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = result.recordset[0];

      
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        res.json({
            msg: 'Login successful',
            user: {
                user_id: user.user_id,
                name: user.name,
                email_id: user.email_id
            }
        });
    } catch (err) {
        console.error(err.message); // Log error for debugging
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.params.id;
    try {
       
        let result = await sql.query`SELECT * FROM Users WHERE user_id = ${userId}`;
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
