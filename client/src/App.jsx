import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Doc from './pages/Doc';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getMe = async () => {
      const res = await axios.get("http://localhost:3001/api/auth/getme", {
        withCredentials: true
      })
      setUser(res.data);
    }


    getMe();
  }, [])
  return (
    <>
      <Routes>

        <Route path="/" element={<Auth user={user} />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/doc/:id" element={<Doc user={user} />} />

      </Routes>
      <Toaster />
    </>
  )
}

export default App