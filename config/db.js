const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDbConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database.');
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        process.exit(1);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { pool, testDbConnection };
