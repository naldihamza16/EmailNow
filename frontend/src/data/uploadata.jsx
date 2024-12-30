import React, { useState } from 'react';

const UploadData = () => {
  const [dataName, setDataName] = useState('');
  const [geography, setGeography] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!dataName || !geography || !file) {
      alert('Please fill all fields and select a file!');
      return;
    }

    const formData = new FormData();
    formData.append('dataName', dataName);
    formData.append('geography', geography);
    formData.append('dataFile', file);

    try {
      setUploading(true);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/data/uploaddata`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      setUploading(false);
      if (response.ok) {
        setSuccessMessage('Data uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 5000); // Hide the success message after 5 seconds
      } else {
        throw new Error(result.message || 'Error uploading data');
      }
    } catch (error) {
      console.error('Error uploading data', error);
      setUploading(false);
    }
  };

  return (

<div className="p-8 bg-gray-50">
<h2 className="text-3xl font-semibold mb-6">Send an Email</h2>
    <div className="max-w-xl mx-auto p-8">
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex flex-col">
          <label htmlFor="dataName" className="font-medium text-gray-700">Data Name</label>
          <input
            type="text"
            id="dataName"
            value={dataName}
            onChange={(e) => setDataName(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the data name"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="geography" className="font-medium text-gray-700">Geography</label>
          <input
            type="text"
            id="geography"
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the geography"
            required
          />
        </div>

        <div className="flex flex-col space-y-2">
        <label htmlFor="dataFile" className="font-medium text-gray-700">Upload File</label>
        <div className="relative">
            {/* The custom file upload button */}
            <input
            type="file"
            id="dataFile"
            onChange={handleFileChange}
            className="file:mr-3 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:bg-gray-100 file:text-gray-700 file:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            required
            />
            {/* File input icon */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            </div>
        </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Data'}
        </button>

        {successMessage && (
          <div
            className="mt-4 text-white bg-green-600 p-3 rounded-md transition-opacity duration-1000 opacity-100"
            style={{ animation: 'fadeIn 2s ease-in-out' }}
          >
            {successMessage}
          </div>
        )}
      </form>
    </div>
</div>
  );
};

export default UploadData;
