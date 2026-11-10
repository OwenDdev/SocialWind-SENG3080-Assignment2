/*
* FILE : Postpage.jsx
* PROJECT : Asiignment2 backend
* PROGRAMMER : Precious Orewen
* FIRST VERSION : 2026-11-08
* DESCRIPTION :
* The function in the file handle the frontend of socail wind were post comments and likes are displyed and made
* Refrence: Bro Code. (2023, October 9). React tutorial for beginners [Video]. YouTube. https://www.youtube.com/watch?v=hn80mWvP-9g&list=PLZPZq0r_RZOMQArzyI32mVndGBZ3D99XQ
*/

import { useState } from 'react'

function PostPage({ username, userid }) {
    const [currentPage, setCurrentPage] = useState('');
    const [userpost, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    
    const [likes, setLikes] = useState({});
    const [userLikes, setUserLikes] = useState({});

    const [usercomment, setUsercomment] = useState('');
    const [comments, setComments] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);

    //
    // FUNCTION : addpost
    // DESCRIPTION : This function adds posts into the database fetching the post endpoint from the backend
    // PARAMETERS : e
    // RETURNS 
    //
    async function addpost(e) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    postcontent: userpost,
                    userid: userid
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            console.log('Post created successfully!');

            setPost('');

        } catch (error) {
            console.error(error);
            console.log('Unable to connect to server');
        }
    }

    //
    // FUNCTION : getpost
    // DESCRIPTION : This function retrieves posts from the database fetching the GET post endpoint from the backend
    // PARAMETERS : 
    // RETURNS 
    //
    async function getposts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        setPosts(data);

        data.forEach((post) => {
            getlike(post.postid);
        });

        } catch (error) {
            console.error(error);
        }
    }


    //
    // FUNCTION : getlike
    // DESCRIPTION : This function retrives likes from the database fetching the likes endpoint from the backend
    // PARAMETERS : postid
    // RETURNS 
    //
    async function getlike(postid) {
    try {
        const response = await fetch( `http://localhost:3000/api/likes/${postid}?userid=${userid}`);

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        setLikes(previousLikes => ({
            ...previousLikes,
            [postid]: data.totalLikes
        }));

        setUserLikes(previousLikes => ({
            ...previousLikes,
            [postid]: data.isLiked
        }));

        } catch (error) {
            console.error(error);
        }
    }

    
    //
    // FUNCTION : addlike
    // DESCRIPTION : This function add likes to a post and the database fetching the likes endpoint from the backend
    // PARAMETERS : postid
    // RETURNS 
    //
    async function addlike(postid) {
    try {
        const response = await fetch('http://localhost:3000/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: userid,
                postid: postid
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        getlike(postid);

        } catch (error) {
            console.error(error);
        }
    }

     //
    // FUNCTION : getcomment
    // DESCRIPTION : This function gets commnets from the database fetching the comments endpoint from the backend
    // PARAMETERS : postid
    // RETURNS 
    //
    async function getcomment(postid) {
    try {
        const response = await fetch(`http://localhost:3000/api/comments/${postid}`);

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        setComments(data);

        } catch (error) {
            console.error(error);
        }
    }

    //
    // FUNCTION : addcomment
    // DESCRIPTION : This function add comment to a post and the database fetching the comments endpoint from the backend
    // PARAMETERS : e
    // RETURNS 
    //
    async function addcomment(e) {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentcontent: usercomment,
                userid: userid,
                postid: selectedPostId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        setUsercomment('');

        getcomment(selectedPostId);

        } catch (error) {
            console.error(error);
            console.log('Unable to connect to server');
        }
    }

     const makepost =   <> 
                        <h2 className="make-post"> Make post </h2>
                        <form onSubmit = {addpost}>
                            <label  htmlFor="fpost">post:</label>
                            <input type="text" id="fname" name="fname"  value={userpost} onChange={(e) => setPost(e.target.value)}></input>

                            <button type="submit">post</button>
                        </form> 
                        </>

    const viewcomment = <>
    <h2 className="viewcomments">Comments</h2>

    <form onSubmit={addcomment}>
        <label htmlFor="comment">Comment:</label>
        <input type="text" id="comment" name="comment" value={usercomment} onChange={(e) => setUsercomment(e.target.value)} />
        <button type="submit">Comment</button>
        </form>

        <div>
            {comments.map((comment) => (
                <div key={comment.commentid}>
                    <h3>{comment.username}</h3>

                    <span>{comment.commentcontent}</span>

                    <p>{new Date(comment.timeofcomment).toLocaleString()}</p>
                </div>
            ))}
        </div>
    </>;

    const viewposts = <>
                        <h2 className="view-post">View posts</h2>

                        {posts.map((post) => (
                            <div key={post.postid}>
                                <h3>{post.username}</h3>

                                <span>{post.postcontent}</span>

                                <div>
                                    <button onClick={() => addlike(post.postid)}>
                                        Like
                                    </button>

                                    <span>{likes[post.postid] || 0} Likes</span>

                                    <button onClick={() => {
                                        if (selectedPostId === post.postid) {
                                            setSelectedPostId(null);
                                            setComments([]);
                                        }
                                        else {
                                            setSelectedPostId(post.postid);
                                            setComments([]);
                                            getcomment(post.postid);
                                        }
                                    }}>
                                        Comment
                                    </button>
                                </div>

                                {selectedPostId === post.postid && viewcomment}

                            </div>
                         ))}
                    </>;

    const viewlike =   <> 
                        <h2 className="total likes"> this just need to show the totals likes (done by doing a summation of content in the like table tha have the id matchng this post)of a page when like including the like the user added </h2>
                        </>

    return(
        <>
            <h1>Social Wind</h1>
            
            <div>
                <h3>Welcome, {username}!</h3>
                <button onClick={() => setCurrentPage('makepost')} >make post</button>
                <button onClick={() => {
                    setCurrentPage('viewposts');
                    getposts();
                }}>view posting</button>
            </div>
            <div>
                {currentPage === 'makepost' && makepost}
                {currentPage === 'viewposts' && viewposts}
            </div>
        </>
    );

}

export default PostPage;