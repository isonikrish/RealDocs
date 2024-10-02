import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FaEdit } from 'react-icons/fa';

function Doc({ user }) {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [docid, setDocId] = useState('');
  const [contributors, setContributors] = useState([]);
  let socket = useRef(null);

  useEffect(() => {
    // Create socket connection
    socket.current = io('http://localhost:3001');

    // Prepare user object safely
    const userToJoin = user ? user : { email: '' };

    // Emit join-document event
    socket.current.emit('join-document', { docId: id, user: userToJoin });

    // Listen for incoming changes
    socket.current.on('receive-changes', (newContent, newTitle) => {
      setContent(newContent);
      setTitle(newTitle); // Update title as well
    });

    // Load document content
    socket.current.on('load-document', (docContent, docTitle, docId) => {
      setContent(docContent);
      setTitle(docTitle);
      setDocId(docId);
    });

    // Listen for user-joined events
    socket.current.on('user-joined', (userEmail) => {
      setContributors((prev) => {
        if (!prev.includes(userEmail)) {
          return [...prev, userEmail];
        }
        return prev;
      });
    });

    // Cleanup on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [id, user]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.current.emit('send-changes', newContent, title); // Emit content and title
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    socket.current.emit('send-changes', content, newTitle); // Emit title and content
  };

  const handleSave = () => {
    // Emit save event to the server
    socket.current.emit('save-document', { docId: id, content, title });

    // Optionally, you can show a "saved" message or handle UI changes after saving.
    alert('Document saved successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <button  
        onClick={handleSave}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
      >
        <FaEdit className="mr-2" /> Save
      </button>

      <div>
        <ul>
          {contributors.map((contributor, index) => (
            <li key={index}>{contributor}</li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 shadow-md rounded-lg p-4 border border-gray-200">
        <div>
          <input 
            type="text" 
            value={title} 
            onChange={handleTitleChange} 
            className="w-full p-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8" 
            placeholder="Title" 
          />
        </div>

        <textarea
          className="w-full h-96 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}

export default Doc;
