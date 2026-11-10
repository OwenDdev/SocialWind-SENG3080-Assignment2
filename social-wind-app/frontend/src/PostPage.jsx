import { useState } from 'react'

function PostPage({ username, userid }) {
    const [currentPage, setCurrentPage] = useState('');
    const [currentsubPage, setCurrentsubPage] = useState('');
    const [userpost, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    
    const [likes, setLikes] = useState({});

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
                alert(data.message);
                return;
            }

            alert('Post created successfully!');

            setPost('');

        } catch (error) {
            console.error(error);
            alert('Unable to connect to server');
        }
    }

    async function getposts() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
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


    async function getlike(postid) {
    try {
        const response = await fetch(`http://localhost:3000/api/likes/${postid}`);

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        setLikes(previousLikes => ({
            ...previousLikes,
            [postid]: data.totalLikes
        }));

        } catch (error) {
            console.error(error);
        }
    }

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
            alert(data.message);
            return;
        }

        getlike(postid);

        } catch (error) {
            console.error(error);
        }
    }

    async function getcomment() {
    }

    async function addcomment() {
    }

     const makepost =   <> 
                        <h2 className="make-post"> Make post </h2>
                        <form onSubmit = {addpost}>
                            <label  htmlFor="fpost">post:</label>
                            <input type="text" id="fname" name="fname"  value={userpost} onChange={(e) => setPost(e.target.value)}></input>

                            <button type="submit">post</button>
                        </form> 
                        </>

    const viewposts = <>
                        <h2 className="view-post">View posts</h2>

                        {posts.map((post) => (
                            <>
                            <div key={post.postid}>
                                <h3>{post.username}</h3>
                                <span>{post.postcontent}</span>
                                <button onClick={() => addlike(post.postid)}> Like </button>

                                <span>
                                    {likes[post.postid] || 0} Likes
                                </span>

                                <button onClick={() => setCurrentsubPage('viewcomment')}>Comment</button>
                            </div>
                            <div>
                                {subcurrentPage === 'makepost' && makepost}
                                {subcurrentPage === 'viewposts' && viewposts}
                            </div>
                            </>
                        ))}
                    </>;

    const viewlike =   <> 
                        <h2 className="total likes"> this just need to show the totals likes (done by doing a summation of content in the like table tha have the id matchng this post)of a page when like including the like the user added </h2>
                        </>

    const viewcomment =   <> 
                        <h2 className="viewcomments"> comnments </h2>
                        <div>
                            <form onSubmit = {addcomment}>
                                <label  htmlFor="fpost">comment:</label>
                                <input type="text" id="fname" name="fname"  value={usercommen} onChange={(e) => setcomment(e.target.value)}></input>

                                <button type="submit">comment</button>
                            </form> 
                        </div>
                        <div>
                            <h3>name of commenter</h3>
                            <span>  basically the same way the show multiple post multiple comments will be display here when button clickde </span>
                        </div>
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