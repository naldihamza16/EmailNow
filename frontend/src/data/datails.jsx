import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Datails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all data from the controller
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/data/getdata`); // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id) => {
    console.log(`Delete action for ID: ${id}`);
    // Add delete logic here
  };

  const handleUpdate = (id) => {
    console.log(`Update action for ID: ${id}`);
    // Add update logic here
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;

  return (
<div className="p-8 bg-gray-50">
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded shadow-md bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">{item.dataName}</h2>
              <p className="text-sm text-gray-600">Geography: {item.geography}</p>
              <a
                href={`${import.meta.env.VITE_REACT_APP_URL}/${item.dataFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm"
              >
                View File
              </a>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(item._id)}
              >
                <FaTrash />
              </button>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleUpdate(item._id)}
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Datails;