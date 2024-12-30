import React, { useEffect, useState } from 'react';

const DataGrid = ({ onFileSelect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
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

  const handleRowSelect = (filePath) => {
    setSelectedFile(filePath);
    onFileSelect(filePath); // Call the parent callback with the selected file
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-xl font-semibold mb-4">Data List</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {data.map((item) => (
            <div
              key={item._id}
              onClick={() => handleRowSelect(item.dataFile)}
              className={`p-2 border rounded shadow-sm bg-white flex flex-col justify-between cursor-pointer text-sm ${
                selectedFile === item.dataFile ? 'border-blue-500' : 'border-gray-300'
              }`}
            >
              <div>
                <h2 className="font-medium mb-1 truncate">{item.dataName}</h2>
                <p className="text-gray-600 truncate">Geography: {item.geography}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedFile && (
          <div className="mt-4 text-sm">
          </div>
        )}
      </div>
    </div>
  );
};

export default DataGrid;
