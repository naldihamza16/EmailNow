import React, { useState } from 'react';

const Addserver = ({ closeModal, addServer }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    username: '',
    image: '',
    port: 22,
    password: '',
    sshKey: '',
    provider: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' }); // Clear any previous message

    try {
      const serverData = {
        name: formData.name,
        ipv4_ipv6: formData.ip,
        username: formData.username,
        image: formData.image,
        sshPort: formData.port,
        password: formData.password,
        sshKey: formData.sshKey,
        provider: formData.provider,
      };

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Server added successfully
        setMessage({ text: 'Server added successfully!', type: 'success' });

        // Delay the server list update to ensure success message appears first
        setTimeout(() => {
          addServer(data.server); // Update UI or state
          closeModal(); // Close the modal after showing the success message
        }, 1000); // Delay by 1 second to show the success message

      } else {
        // Backend returned an error message
        setMessage({
          text: data.message || 'Failed to add server. Please check your inputs.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error adding server:', error);
      setMessage({
        text: 'An unexpected error occurred. Please try again later.',
        type: 'error',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Server</h2>

        {/* Display message */}
        {message.text && (
          <div
            className={`mb-4 p-2 rounded-md text-center ${
              message.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Server Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">IP Address</label>
            <input
              type="text"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">OS Image</label>
            <select
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select OS Image
              </option>
              <option value="Ubuntu 20.04">Ubuntu 20.04</option>
              <option value="Ubuntu 22.04">Ubuntu 22.04</option>
              <option value="CentOS 7">CentOS 7</option>
              <option value="CentOS 8">CentOS 8</option>
              <option value="Debian 10">Debian 10</option>
              <option value="Debian 11">Debian 11</option>
              <option value="Almalinux 8.10">Almalinux 8.10</option>
              <option value="Windows Server 2019">Windows Server 2019</option>
              <option value="Windows Server 2022">Windows Server 2022</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">SSH Port</label>
            <input
              type="number"
              name="port"
              value={formData.port}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">SSH Key (Optional)</label>
            <textarea
              name="sshKey"
              value={formData.sshKey}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Provider</label>
            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Provider
              </option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="Google Cloud">Google Cloud</option>
              <option value="DigitalOcean">DigitalOcean</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addserver;
