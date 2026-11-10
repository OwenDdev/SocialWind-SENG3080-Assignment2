/*
* FILE : App.jsx
* PROJECT : Asiignment2 backend
* PROGRAMMER : Precious Orewen
* FIRST VERSION : 2026-11-08
* DESCRIPTION :
* This is th base file for the frontend of social wind
*/

import { useState, useEffect } from 'react'

import './App.css'
import UserPage from './UserPage.jsx'
import PostPage from './PostPage.jsx'


function App() {
  const [username, setUsername] = useState(
    localStorage.getItem('username') || ''
    );

    const [userid, setUserid] = useState(
        Number(localStorage.getItem('userid')) || null
    );

    useEffect(() => {
    if (username !== '' && userid !== null) {
        localStorage.setItem('username', username);
        localStorage.setItem('userid', userid);
    }
}, [username, userid]);

  if (username === '') {
        return (<UserPage setUsername={setUsername} setUserid={setUserid} /> );
    }
    else {
        return (<PostPage username={username} userid={userid} />) ;
    }
}

export default App
