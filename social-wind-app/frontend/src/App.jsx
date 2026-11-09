import { useState } from 'react'

import './App.css'
import UserPage from './UserPage.jsx'
import PostPage from './PostPage.jsx'

function App() {
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState(null);

  if (username === '') {
        return (<UserPage setUsername={setUsername} setUserid={setUserid} /> );
    }
    else {
        return (<PostPage username={username} userid={userid} />) ;
    }
}

export default App
