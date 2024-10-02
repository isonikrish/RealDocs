import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home({ user }) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to generate random ObjectId
  function generateObjectId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Function to create a new document
  function createDocument() {
    const randomId = generateObjectId();
    navigate(`/doc/${randomId}`);
  }

  // Fetch documents from API on component mount
  useEffect(() => {
    if (user) {
      axios
        .get('http://localhost:3001/api/doc/get', {
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.docs.length === 0) {
            setError('No documents found.');
          } else {
            setDocuments(response.data.docs);
          }
        })
        .catch((error) => {
          console.error('Error fetching documents:', error);
          setError('Error fetching documents. Please try again later.');
        });
    }
  }, [user]);

  // Function to delete a document
  const deleteDocument = (docId) => {
    axios
      .delete(`http://localhost:3001/api/doc/${docId}`, {
        withCredentials: true,
      })
      .then(() => {
        // Remove the document from the UI
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
        if (documents.length === 1) setError('No documents found.');
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
        setError('Error deleting document. Please try again.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Hello, {user?.username}
      </h1>

      <div className="flex justify-center items-center mb-6">
        <button
          onClick={createDocument}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> New Document
        </button>
      </div>

      {/* Show error or no documents message */}
      {error && (
        <p className="text-center text-red-500 font-bold mb-6">{error}</p>
      )}

      {/* Only show documents if the user is logged in */}
      {user && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white shadow-md p-4 rounded-lg border border-gray-300"
            >
              <h2 className="font-bold text-xl mb-2">{doc.title}</h2>
              <p className="text-gray-700 truncate mb-4">
                {doc.content.substring(0, 100)}... {/* Show first 100 characters */}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/doc/${doc._id}`)}
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 flex items-center"
                >
                  <FaEdit className="mr-2" /> Open
                </button>
                <button
                  onClick={() => deleteDocument(doc._id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 flex items-center"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
