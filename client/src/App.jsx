import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Auth from './pages/auth';
import Doc from './pages/doc';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/doc" element={<Doc />} />
        
      </Routes>
      <Toaster />
    </>
  )
}

export default App