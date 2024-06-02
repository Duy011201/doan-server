const mysql = require('mysql2');
require('dotenv').config();

const connectDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connectDB.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database success');
});

module.exports = connectDB;
