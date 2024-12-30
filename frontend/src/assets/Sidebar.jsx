import React from "react";
import { Link } from "react-router-dom";
import { FaServer, FaGlobe, FaHandsHelping, FaDatabase, FaUpload } from "react-icons/fa"; // Import icons
import { HiOutlineDocumentText } from "react-icons/hi"; // Example of another icon library
import { AiOutlineSetting } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 flex flex-col justify-between border-e bg-white h-screen">
        <div className="px-4 py-6">
          <ul className="mt-6 space-y-1">

            {/* Link to Dashboard page */}
            <li>
              <Link
                to="/"
                className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Dashboard
              </Link>
            </li>

            {/* Link to Production page */}
            <li>
              <Link
                to="/production"
                className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <AiOutlineSetting /> Production
              </Link>
            </li>

            {/* Other links */}
            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <FaServer /> Servers
                  </span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <Link
                      to="/getservers"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
                    >
                      <FaServer /> Server Stock
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/installservers"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
                    >
                      <FaServer /> Install Server
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
              >
                <FaGlobe /> Domains
              </a>
            </li>

            <li>
              <a
                href="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
              >
                <FaHandsHelping /> Sponsors
              </a>
            </li>

            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <FaDatabase /> Data
                  </span>
                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <Link
                      to="/details"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
                    >
                      <HiOutlineDocumentText /> Details
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/uploadata"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 flex items-center gap-2"
                    >
                      <FaUpload /> Upload Data
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
