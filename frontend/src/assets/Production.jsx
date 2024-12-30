import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import MyCombobox from "./combolist";
import DataGrid from "./datagrid";



const ItemType = "server";

// Notification component
const Notification = ({ type, message, onClose }) => (
  <div
    className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <p>{message}</p>
    <button
      onClick={onClose}
      className="mt-2 text-sm underline text-white hover:text-gray-200"
    >
      Close
    </button>
  </div>
);

// Individual server component
const Server = ({ server }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id: server._id, name: server.name, ip: server.ipv4_ipv6 },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-2 bg-blue-100 rounded shadow-sm flex flex-col items-center justify-center ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        cursor: "move",
        minWidth: "100px",
        height: "35px",
      }}
    >
      <p className="text-sm font-medium text-gray-700 truncate">{server.name} : ({server.ipv4_ipv6 || "No IP Available"})</p>
    </div>
  );
};

// Drop area component
const DropArea = ({ selectedServers, onDrop, onClear }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 border-2 border-dashed rounded-lg ${
        isOver ? "bg-gray-100 border-gray-500" : "bg-white border-gray-400"
      }`}
    >
      <h3 className="text-lg font-medium text-gray-700 mb-2">Drop Servers Here</h3>
      {selectedServers.length > 0 ? (
        <div className="mt-2">
          <p className="text-gray-500 text-sm">Selected Servers:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedServers.map((server, index) => (
              <p
                key={index}
                className="px-2 py-1 bg-blue-200 text-sm text-gray-700 rounded"
              >
                {server.name} ({server.ip || "No IP"})
              </p>
            ))}
          </div>
          <button
            onClick={onClear}
            className="mt-2 p-2 bg-red-500 text-white text-xs rounded-md"
          >
            Clear Servers
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">No servers selected yet.</p>
      )}
    </div>
  );
};

// Main Production component
const Production = () => {
  const [formData, setFormData] = useState({
    to: "",
    from: "",
    subject: "",
    body: "",
    selectedServers: [],
    messageId: '',        // Default value as empty string
    contentType: '',
    mimeVersion: '',
    sender: '',
    returnPath: '',
    Header: '',
  });
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch servers from the API
  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch servers");
        }
        const data = await response.json();
        setServers(data.servers || []);
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServerDrop = (server) => {
    setFormData((prev) => {
      // Check if the server is already in the selectedServers list
      const isDuplicate = prev.selectedServers.some(
        (selected) => selected.ip === server.ip
      );
  
      // If it's not a duplicate, add it to the selectedServers list
      if (!isDuplicate) {
        return {
          ...prev,
          selectedServers: [
            ...prev.selectedServers,
            { id: server.id, name: server.name, ip: server.ip },
          ],
        };
      }
  
      // If it's a duplicate, return the state as-is
      return prev;
    });
  };
  

  const handleClearServers = () => {
    setFormData((prev) => ({ ...prev, selectedServers: [] }));
  };

// Send Email

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate form data before proceeding
  if (!formData.from || !formData.subject || !formData.body) {
    setNotification({
      type: "error",
      message: "Please fill in all required fields.",
    });
    return;
  }

  const staticPayload = {
    from: formData.from,
    to: {
      inputparam: formData.to,
      recipient: selectedFile ? selectedFile : null,
    },
    subject: formData.subject,
    body: formData.body,
    servers: formData.selectedServers.map((server) => ({
      name: server.name,
      ip: server.ip,
    })),
    messageId: formData.messageId || "xchemakaar_v1.0@emailnow.com",
    contentType: formData.contentType || "text/plain",
    mimeVersion: formData.mimeVersion || "1.0",
    sender: formData.sender || "support@emailnow.com",
    returnPath: formData.returnPath || "support@emailnow.com",
    textHeaders: formData.Header || "",
  };

  console.log("Submitting email payload:", staticPayload);

  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/servers/sendemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staticPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setNotification({
        type: "error",
        message: `Failed to send email: ${errorData.message || "Unknown error"}`,
      });
    } else {
      const result = await response.json();
      setNotification({
        type: "success",
        message: "Email sent successfully!",
      });
    }
  } catch (error) {
    setNotification({
      type: "error",
      message: `Error: ${error.message}`,
    });
  }
};

// File selection state
const [selectedFile, setSelectedFile] = useState(null);

// File selection handler
const handleFileSelect = (filePath) => {
  setSelectedFile(filePath);
};


  

  return (
    <>
<div className="p-8 bg-gray-50">
  <h2 className="text-3xl font-semibold mb-6">Send an Email</h2>
  
  {/* Container to align both parts side by side */}
  <div className="flex">
  
    {/* First part */}
    <article className="m-10 w-2/4 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="Return-path">Return-path</label>
            <input
              type="email"
              id="returnPath"
              name="returnPath"
              value={formData.returnPath}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="from">From</label>
            <input
              type="email"
              id="from"
              name="from"
              value={formData.from}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="to">To</label>
            <input
              type="email"
              id="to"
              name="to"
              value={formData.to}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="body">Body</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-36 py-1 px-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Send Email
          </button>
        </form>
    </article>
  
    {/* Second part */}

        <article className="m-10 w-2/4 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          {/* Affiliate Manager section */}
            <h3 className="m-2 text-sm font-medium text-gray-700 mr-4">Affiliate Manager</h3>
            <MyCombobox />

          {/* Select an offer section */}
            <h3 className="m-2 text-sm font-medium text-gray-700 mr-4">Select an offer</h3>
            <MyCombobox />

            <div>
            <label className="m-2 block text-sm font-medium text-gray-700" htmlFor="Return-path">Message-id</label>
            <input
              type="text"
              id="messageId"
              name="messageId"
              value={formData.messageId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="m-2 block text-sm font-medium text-gray-700" htmlFor="Return-path">Content-Type</label>
            <input
              type="text"
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="m-2 block text-sm font-medium text-gray-700" htmlFor="Return-path">MIME-Version</label>
            <input
              type="text"
              id="mimeVersion"
              name="mimeVersion"
              value={formData.mimeVersion}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="m-2 block text-sm font-medium text-gray-700" htmlFor="Return-path">Sender</label>
            <input
              type="text"
              id="sender"
              name="sender"
              value={formData.sender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
          <label className="m-2 block text-sm font-medium text-gray-700" htmlFor="body">Header</label>
            <textarea
              id="Header"
              name="Header"
              value={formData.Header}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
        </article>



  </div>

    {/* Data selction Area */}


  <article className="m-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
  <DataGrid onFileSelect={handleFileSelect} />
      {selectedFile && (
        <div className="mt-4">
          <p>
            <strong>Selected Data:</strong> {selectedFile}
          </p>
        </div>
      )}
  </article>





         {/* Servers Area */}

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Server Selection</h3>
        <DropArea
          selectedServers={formData.selectedServers}
          onDrop={handleServerDrop}
          onClear={handleClearServers}
        />
        <div className="grid grid-cols-4 gap-4 mt-4">
          {loading ? (
            <p className="text-gray-400">Loading servers...</p>
          ) : servers.length > 0 ? (
            servers.map((server) => <Server key={server._id} server={server} />)
          ) : (
            <p className="text-gray-400">No servers available</p>
          )}
        </div>        
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>

    </>
  );
};

export default Production;
