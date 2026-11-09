import { useState } from 'react'

function UserPage() {
    const [username, setUsername] = useState('');

    // adds username into the dataabase
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
                //alert(data.message);
                return;
            }

            // alert(`Welcome ${data.username}! Your ID is ${data.userid}`);

        } catch (error) {
            console.error(error);
            //alert('Unable to connect to server');
        }
    }

    // checks if username is already in datbase
    function checkuser(){

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