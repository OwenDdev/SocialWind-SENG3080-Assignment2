/*
* FILE : USerpage.jsx
* PROJECT : Asiignment2 backend
* PROGRAMMER : Precious Orewen
* FIRST VERSION : 2026-11-08
* DESCRIPTION :
* The function in the file act as an entry poin fo the user to the frontend of socail wind
*/

import { useState } from 'react'

function UserPage({ setUsername: updateUsername, setUserid }) {
    const [username, setUsername] = useState('');

    //
    // FUNCTION : adduser
    // DESCRIPTION : This function adds username into the database fetching th user endpoint from the backend
    // PARAMETERS : e
    // RETURNS 
    //
    async function adduser(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }
            
            updateUsername(data.username);
            setUserid(data.userid);


        } catch (error) {
            console.error(error);
            console.log('Unable to connect to server');
        }
    }

    return(
        <div>
            <h1>Social Wind</h1>
            
            <form onSubmit = {adduser}>
                 <label  htmlFor="fname">Username:</label>
                 <input type="text" id="fname" name="fname"  value={username} onChange={(e) => setUsername(e.target.value)}></input>

                 <button type="submit">Start posting</button>
            </form>
        </div>
    );
}

export default UserPage;