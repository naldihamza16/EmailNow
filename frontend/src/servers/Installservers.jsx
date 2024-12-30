import React, { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoSettingsSharp } from 'react-icons/io5'; // Added the configuration icon
import Addserver from "./Addserver";

const InstallServers = () => {
  const [servers, setServers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null); // Changed to store a single selected row
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddServer, setShowAddServer] = useState(false);
  const [pmtaVersion, setPmtaVersion] = useState("4.5"); // Default PMTA version
  const [installationProgress, setInstallationProgress] = useState(null); // Track installation progress
  const itemsPerPage = 10;

  const totalPages = Math.ceil(servers.length / itemsPerPage);

  // Calculate paginated servers
  const paginatedServers = servers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Random domains generator
  const generateRandomDomains = () => {
    const domainCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 domains
    const domains = ["example.com", "test.com", "demo.org", "website.net"];
    return Array.from({ length: domainCount }, () =>
      domains[Math.floor(Math.random() * domains.length)]
    );
  };

  // Fetch servers from the backend and add random data
  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers`);
        const data = await response.json();

        if (data.success) {
          // Add random domains and ports to servers
          const enrichedServers = data.servers.map((server) => ({
            ...server,
            domains: generateRandomDomains(),
            port: 22, // Default SSH port
          }));
          setServers(enrichedServers);
        } else {
          setError(data.message || "Failed to fetch servers");
        }
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  // Handle individual checkbox changes (Single selection)
  const handleCheckboxChange = (id) => {
    setSelectedRow(id === selectedRow ? null : id); // Toggle selection
  };

  // Handle Add Server Button Click
  const handleAddServerClick = () => {
    setShowAddServer(true);
  };

  // Handle PMTA version change
  const handlePmtaVersionChange = (e) => {
    setPmtaVersion(e.target.value);
  };

  // Handle the Install Server Button Click
  const handleInstallServerClick = async () => {
    if (!selectedRow) {
      setError("Please select a server to install PowerMTA.");
      return;
    }

    const params = servers.find((server) => server._id === selectedRow);
    if (!params) {
      setError("Selected server not found.");
      return;
    }

    setInstallationProgress("Starting installation...");

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers/install`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip: params.ipv4_ipv6, // Get the selected server's IP
          username: params.username, // Get the selected server's username
          password: params.password, // Get the selected server's password
          zipFilePath: "C:/Users/HP-G4/Desktop/EmailNow/backend/controllers/tmp/pmta/rpms/pmta64.rpm", // Specify path to the PowerMTA ZIP file
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInstallationProgress(data.message);
      } else {
        setInstallationProgress(`Error: ${data.message}`);
      }
    } catch (err) {
      setInstallationProgress(`Installation failed: ${err.message}`);
    }
  };

  return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
          {!showAddServer ? (
            <>
              <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
                Install Servers
              </h1>

              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddServerClick}
                  className="flex items-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 text-lg font-semibold rounded-md transition duration-300"
                >
                  <FaPlusCircle className="mr-2" />
                  Add Server
                </button>
              </div>

              {loading && (
                <p className="text-center text-gray-500">Loading servers...</p>
              )}
              {error && <p className="text-center text-red-500">{error}</p>}

              <div className="overflow-x-auto shadow-2xl rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <th className="px-4 py-3 text-left font-bold uppercase">Select</th>
                      <th className="px-4 py-3 text-left font-bold uppercase">Server Name</th>
                      <th className="px-4 py-3 text-left font-bold uppercase">IP_Address</th> {/* New column for IP Address */}
                      <th className="px-4 py-3 text-left font-bold uppercase">Username</th>
                      <th className="px-4 py-3 text-left font-bold uppercase">Password</th>
                      <th className="px-4 py-3 text-left font-bold uppercase">Domain</th>
                      <th className="px-4 py-3 text-left font-bold uppercase">Default Port</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedServers.length > 0 ? (
                      paginatedServers.map((server) => (
                        <tr
                          key={server._id} // Use server.id as the unique key for each row
                          className="hover:bg-blue-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded-md"
                              checked={selectedRow === server._id} // Only check if selectedRow matches current server id
                              onChange={() => handleCheckboxChange(server._id)} // Toggle selection on click
                            />
                          </td>
                          <td className="px-4 py-3 text-gray-700 font-medium">
                            {server.name}
                          </td>
                          <td className="px-4 py-3 text-gray-700"> {/* Display the IP address */}
                            {server.ipv4_ipv6}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {server.username}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {server.password}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Select a domain
                              </option>
                              {server.domains.map((domain, index) => (
                                <option key={index} value={domain}>
                                  {domain}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={server.port}
                              disabled
                              className="w-small px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7" // Update colspan to include the new column
                          className="px-4 py-3 text-center text-gray-500"
                        >
                          No servers available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="px-3 py-2 bg-red-300 rounded-md text-red-700 font-medium"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <p className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  className="px-3 py-2 bg-red-300 rounded-md text-red-700 font-medium"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>

              {/* Install Server Button */}
              <div className="flex items-center space-x-4 py-4">
              <button
                  onClick={handleInstallServerClick}
                  className="text-sm flex items-center text-white bg-red-500 hover:bg-red-600 px-4 py-3 font-medium rounded-md"
                >
                  <IoSettingsSharp className="mr-2" /> {/* Configuration icon */}
                  Install PowerMTA
              </button>

              <select className="px-8 py-2 text-sm font-semibold border rounded-md bg-white">
                <option value="option1">Pmta v 4.0</option>
                <option value="option2">Pmta v 4.5</option>
                <option value="option3">Pmta v 5.0</option>
              </select>

                {installationProgress && (
                  <p className="mt-4 text-sm text-gray-700">
                    {installationProgress}
                  </p>
                )}
              </div>
            </>
          ) : (
            <Addserver closeModal={() => setShowAddServer(false)}/>
          )}
        </div>

  );
};

export default InstallServers;
