import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Navbar from "./assets/Navbar";
import Sidebar from "./assets/Sidebar";
import Dashboard from "./assets/Dashboard";
import Production from "./assets/Production";
import GetServers from "./servers/Getservers";
import Installservers from "./servers/Installservers";
import Uploadata from "./data/uploadata";
import Datails from "./data/datails";
import Login from "./users/login";
import SignUp from "./users/signup";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirect to login
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen flex flex-col">
          {isAuthenticated && (
            <>
              <Navbar handleLogout={handleLogout} />
              <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 bg-white overflow-auto">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/uploadata" element={<ProtectedRoute><Uploadata /></ProtectedRoute>} />
                    <Route path="/details" element={<ProtectedRoute><Datails /></ProtectedRoute>} />
                    <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
                    <Route path="/getservers" element={<ProtectedRoute><GetServers /></ProtectedRoute>} />
                    <Route path="/installservers" element={<ProtectedRoute><Installservers /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Redirect to dashboard if authenticated */}
                  </Routes>
                </div>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown routes to login */}
            </Routes>
          )}
        </div>
      </DndProvider>
    </Router>
  );
}

export default App;
