const mysql = require('mysql2');
const keys = require('./index')

const pool = mysql.createPool({
    host: keys.DATA_BASE.host, 
    user: keys.DATA_BASE.user, 
    database: keys.DATA_BASE.database,
    password : keys.DATA_BASE.password,
    port : keys.DATA_BASE.port,
});

const db_pool = pool.promise();  

module.exports = db_pool;