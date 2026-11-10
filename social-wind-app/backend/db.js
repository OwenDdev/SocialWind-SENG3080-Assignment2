/*
* FILE : db.js
* PROJECT : Asiignment2 backend
* PROGRAMMER : Precious Orewen
* FIRST VERSION : 2026-11-08
* DESCRIPTION :
* This file connects the server/backend to the database of social wind.
*/

const sql = require('mssql/msnodesqlv8');

const config = {
    server: 'localhost\\SQLEXPRESS',
    database: 'SocialWind',
    driver: 'ODBC Driver 18 for SQL Server',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(config);

module.exports = pool;