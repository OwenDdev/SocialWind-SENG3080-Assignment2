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

// Add post endpoint
app.post('/api/posts', async (req, res) => {
    try {
        const { postcontent, userid } = req.body;

        // Check required fields
        if (!postcontent || !postcontent.trim() || !userid) {
            return res.status(400).json({
                message: 'Post content and user ID are required'
            });
        }

        const db = await pool.request()
            .input('postcontent', sql.VarChar(500), postcontent.trim())
            .input('userid', sql.Int, userid)
            .query(`
                INSERT INTO Posts (postcontent, userid)
                OUTPUT INSERTED.*
                VALUES (@postcontent, @userid)
            `);

        res.status(201).json(db.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const db = await pool.request()
            .query(`
                SELECT
                    Posts.postid,
                    Posts.postcontent,
                    Posts.timeofpost,
                    Users.username
                FROM Posts
                INNER JOIN Users
                    ON Posts.userid = Users.userid
                ORDER BY Posts.timeofpost DESC, Posts.postid DESC
            `);

        res.status(200).json(db.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

app.post('/api/likes', async (req, res) => {
    try {
        const { userid, postid } = req.body;

        if (!userid || !postid) {
            return res.status(400).json({
                message: 'User ID and post ID are required'
            });
        }

        const db = await pool.request()
            .input('userid', sql.Int, userid)
            .input('postid', sql.Int, postid)
            .query(`
                INSERT INTO Likes (isliked, userid, postid)
                VALUES (1, @userid, @postid)
            `);

        res.status(201).json({
            message: 'Post liked successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to add like'
        });
    }
});

// Get like count for a post
app.get('/api/likes/:postid', async (req, res) => {
    try {
        const postid = req.params.postid;

        const db = await pool.request()
            .input('postid', sql.Int, postid)
            .query(`
                SELECT COUNT(*) AS totalLikes
                FROM Likes
                WHERE postid = @postid AND isliked = 1
            `);

        res.status(200).json(db.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to retrieve likes'
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

