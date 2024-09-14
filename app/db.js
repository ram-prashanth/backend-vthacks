require('dotenv').config(); 
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // true for Azure
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', // false by default for Azure
        loginTimeout: parseInt(process.env.DB_LOGIN_TIMEOUT, 10)
    }
};

// Function to connect to the database
async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Connected to MSSQL Database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

module.exports = { sql, connectDB };
