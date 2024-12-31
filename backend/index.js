import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import serverRoutes from "./routes/server.route.js"; 
import userRoutes from "./routes/user.route.js";
import dataRoutes from "./routes/data.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 1444;

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allowed origins for CORS
const allowedOrigins = ["https://email-now-ku6l.vercel.app", "https://email-now-eight.vercel.app"];

// CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // If no origin is provided (e.g., for local requests), allow it
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false, // Ensures preflight OPTIONS request is handled automatically
  optionsSuccessStatus: 200 // Set to 200 for successful preflight response
}));

// Serve files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to parse JSON bodies
app.use(express.json());

// Open Route
app.get("/", (req, res) => {
    res.send("Backend");
});

// Use the server routes
app.use("/api/servers", serverRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);

// Error handling middleware
app.get("/test", (req, res) => {
    res.send("Backend is working!");
});

// Handle OPTIONS requests explicitly (for CORS preflight)
app.options('*', (req, res) => {
  res.sendStatus(200); // Respond with a 200 status for OPTIONS requests
});

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server started at http://localhost:${port}`);
});
