import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client'
function Doc() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  let socket = useRef(null);
  useEffect(() => {
    socket.current = io('http://localhost:3001');
    socket.current.emit('join-document', id);
    socket.current.on('receive-changes', (changes) => {
      setContent(changes);
    });
    socket.current.on('load-document', (docContent) => {
      setContent(docContent);
    });
    return () => {
      socket.current.disconnect();
    };
  }, [id]);
  const handleChange = (e) => {
    setContent(e.target.value);
    socket.current.emit('send-changes', e.target.value);
  };


  return (
    <div className="container mx-auto p-4">


      {/* Text area for editing the document */}
      <div className="bg-gray-50 shadow-md rounded-lg p-4 border border-gray-200">
        <textarea
          className="w-full h-96 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default Doc