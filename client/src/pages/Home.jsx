import React from 'react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function Home({user}) {
  const navigate = useNavigate();
  function createDocument(){
    const randomId = Math.random().toString(36).substring(2, 15);
    navigate(`/doc/${randomId}`);
  }
  return (
    <div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Your Documents</h1>
      <button 
        onClick={createDocument} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
      >
        <FaPlus className="mr-2" /> New Document
      </button>
    </div>
    </div>
  )
}

export default Home