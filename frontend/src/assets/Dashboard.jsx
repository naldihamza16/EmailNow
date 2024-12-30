import React from "react";
import { FiMail, FiBarChart, FiUsers } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Dashboard Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Email Campaign Dashboard</h1>
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">Filter by Date:</label>
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Open Rate */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Open Rate</h3>
            <p className="text-3xl font-semibold">82%</p>
          </div>
          <FiMail className="text-5xl" />
        </div>

        {/* Click-through Rate */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Click-through Rate</h3>
            <p className="text-3xl font-semibold">18%</p>
          </div>
          <FiBarChart className="text-5xl" />
        </div>

        {/* Bounce Rate */}
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Bounce Rate</h3>
            <p className="text-3xl font-semibold">5%</p>
          </div>
          <FiUsers className="text-5xl" />
        </div>
      </div>

      {/* Performance Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Open Rate Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "82%" }}></div>
          </div>
          <p className="text-gray-600">82% of your subscribers opened the email.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Click-through Rate Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "18%" }}></div>
          </div>
          <p className="text-gray-600">18% of the recipients clicked through the email.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Bounce Rate Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "5%" }}></div>
          </div>
          <p className="text-gray-600">5% of your emails bounced.</p>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Campaigns</h3>
        <ul className="space-y-4">
          <li className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Campaign 1: Black Friday Sale</span>
            <span className="text-green-600 font-semibold">Success</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Campaign 2: Winter Promotions</span>
            <span className="text-yellow-600 font-semibold">Pending</span>
          </li>
          <li className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Campaign 3: Summer Offers</span>
            <span className="text-red-600 font-semibold">Failed</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
