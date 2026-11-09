const express = require('express');
const cors = require('cors');

const sql = require('mssql');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
    res.send('Social Wind API is running');
});


// Add user endpoint
app.post('/api/users', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || !username.trim()) {
            return res.status(400).json({
                message: 'Username is required'
            });
        }

        const db = await pool.request()
            .input('username', sql.VarChar(50), username.trim())
            .query(
                `INSERT INTO Users (username)
                OUTPUT INSERTED.userid, INSERTED.username
                VALUES (@username)`
            );

        res.status(201).json(db.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// Start server after database connection
pool.connect()
    .then(() => {
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch(error => {
        console.error('Database connection failed:', error);
    });

