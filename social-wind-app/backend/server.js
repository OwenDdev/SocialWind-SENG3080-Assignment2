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

// Add user or retrieve existing user
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
            .query(`
                IF EXISTS (
                    SELECT 1 FROM Users WHERE username = @username
                )
                BEGIN
                    SELECT userid, username, 0 AS isNew
                    FROM Users
                    WHERE username = @username
                END
                ELSE
                BEGIN
                    INSERT INTO Users (username)
                    OUTPUT INSERTED.userid, INSERTED.username, 1 AS isNew
                    VALUES (@username)
                END
            `);

        const user = db.recordset[0];

        if (user.isNew === 1) {
            return res.status(201).json(user);
        }
        else {
            return res.status(200).json(user);
        }

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
                IF EXISTS (
                    SELECT 1 FROM Likes
                    WHERE userid = @userid AND postid = @postid
                )
                BEGIN
                    UPDATE Likes
                    SET isliked = CASE
                        WHEN isliked = 1 THEN 0
                        ELSE 1
                    END
                    WHERE userid = @userid AND postid = @postid;

                    SELECT isliked FROM Likes
                    WHERE userid = @userid AND postid = @postid;
                END
                ELSE
                BEGIN
                    INSERT INTO Likes (isliked, userid, postid)
                    VALUES (1, @userid, @postid);

                    SELECT 1 AS isliked;
                END
            `);

        res.status(200).json({
            isliked: db.recordset[0].isliked
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to update like'
        });
    }
});

// Get like count for a post
app.get('/api/likes/:postid', async (req, res) => {
    try {
        const postid = req.params.postid;
        const userid = req.query.userid;

        const db = await pool.request()
            .input('postid', sql.Int, postid)
            .input('userid', sql.Int, userid)
            .query(`
                SELECT
                    COUNT(CASE WHEN isliked = 1 THEN 1 END) AS totalLikes,
                    ISNULL(MAX(CASE
                        WHEN userid = @userid THEN isliked
                    END), 0) AS isLiked
                FROM Likes
                WHERE postid = @postid
            `);

        res.status(200).json(db.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to retrieve likes'
        });
    }
});

// Add comment endpoint
app.post('/api/comments', async (req, res) => {
    try {
        const { commentcontent, userid, postid } = req.body;

        if (!commentcontent || !commentcontent.trim() || !userid || !postid) {
            return res.status(400).json({
                message: 'Comment, user ID and post ID are required'
            });
        }

        const db = await pool.request()
            .input('commentcontent', sql.VarChar(500), commentcontent.trim())
            .input('userid', sql.Int, userid)
            .input('postid', sql.Int, postid)
            .query(`
                INSERT INTO Comments (commentcontent, userid, postid)
                OUTPUT INSERTED.*
                VALUES (@commentcontent, @userid, @postid)
            `);

        res.status(201).json(db.recordset[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to add comment'
        });
    }
});

// Get comments for a post
app.get('/api/comments/:postid', async (req, res) => {
    try {
        const postid = req.params.postid;

        const db = await pool.request()
            .input('postid', sql.Int, postid)
            .query(`
                SELECT
                    Comments.commentid,
                    Comments.commentcontent,
                    Comments.timeofcomment,
                    Users.username
                FROM Comments
                INNER JOIN Users
                    ON Comments.userid = Users.userid
                WHERE Comments.postid = @postid
                ORDER BY Comments.timeofcomment DESC, Comments.commentid DESC
            `);

        res.status(200).json(db.recordset);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Unable to retrieve comments'
        });
    }
});

// Start server after database connection
//pool.connect()
//    .then(() => {
//        app.listen(3000, () => {
//            console.log('Server running on port 3000');
//        });
//    })
//    .catch(error => {
//        console.error('Database connection failed:', error);
//    });

if (require.main === module) {
    pool.connect()
        .then(() => {
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
        })
        .catch(error => {
            console.error('Database connection failed:', error);
        });
}

// Export app for automated testing
module.exports = app;
