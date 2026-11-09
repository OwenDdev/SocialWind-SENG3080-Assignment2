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