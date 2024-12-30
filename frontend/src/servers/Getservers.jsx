import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const GetServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    // Function to fetch servers from the backend
    const fetchServers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers`); // Replace with your actual API endpoint
        const data = await response.json();

        if (data.success) {
          setServers(data.servers); // Update state with the server data
        } else {
          setError(data.message || "Failed to load servers.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching the server data.");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit server with ID: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          alert('Server deleted successfully!');
          // Update the server list after deletion
          setServers(servers.filter((server) => server._id !== id));
        } else {
          alert(data.message || 'Failed to delete server.');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the server.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading servers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
        Server Management Dashboard
      </h1>

      <div className="overflow-x-auto shadow-2xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="px-6 py-3 text-left font-bold tracking-wide uppercase">Server Name</th>
              <th className="px-6 py-3 text-left font-bold tracking-wide uppercase">IP Address</th>
              <th className="px-6 py-3 text-left font-bold tracking-wide uppercase">Provider</th>
              <th className="px-6 py-3 text-left font-bold tracking-wide uppercase">Date Added</th>
              <th className="px-6 py-3 text-center font-bold tracking-wide uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {servers.map((server) => (
              <tr
                key={server._id} // Assuming MongoDB's ObjectId is used
                className="hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-gray-700 font-medium">{server.name}</td>
                <td className="px-6 py-4 text-gray-700">{server.ipv4_ipv6}</td>
                <td className="px-6 py-4 text-gray-700">{server.provider}</td>
                <td className="px-6 py-4 text-gray-700">{server.date}</td>
                <td className="px-6 py-4 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handleEdit(server._id)}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(server._id)}
                    className="text-red-500 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetServers;
