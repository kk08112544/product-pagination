const { Pool } = require('pg');
const dbConfig = require('../config/db.config');

const pool = new Pool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: dbConfig.PORT 
});

pool.connect((err, client, release) => {
    if (err) {
        console.log("PostgreSQL connection: " + err);
    } else {
        console.log("Successfully connected to the database.");
        release();
    }
});

module.exports = pool;
