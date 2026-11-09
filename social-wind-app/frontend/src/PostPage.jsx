import { useState } from 'react'

function PostPage({ username, userid }) {
    const [currentPage, setCurrentPage] = useState('');
    const [userpost, setPost] = useState('');

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


     const makepost =   <> 
                        <h2 className="make-post"> Make post </h2>
                        <form onSubmit = {addpost}>
                            <label  htmlFor="fpost">post:</label>
                            <input type="text" id="fname" name="fname"  value={userpost} onChange={(e) => setPost(e.target.value)}></input>

                            <button type="submit">post</button>
                        </form> 
                        </>

    const viewposts = <>
                        <h2 className="view-post"> View post </h2>
                    
                        </>



    return(
        <>
            <h1>Social Wind</h1>
            
            <div>
                <h3>Welcome, {username}!</h3>
                <button onClick={() => setCurrentPage('makepost')} >make post</button>
                <button onClick={() => setCurrentPage('viewposts')} >view posting</button>
            </div>
            <div>
                {currentPage === 'makepost' && makepost}
                {currentPage === 'viewposts' && viewposts}
            </div>
        </>
    );

}

export default PostPage;