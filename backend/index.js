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

// CORS configuration
const corsOptions = {
  origin: 'https://email-now-oj75.vercel.app', // Allow your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (cookies, authentication)
  optionsSuccessStatus: 200 // For legacy browsers (like IE11)
};

app.use(cors(corsOptions));

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

app.listen(port, () => {
    connectDB();
    console.log(`Server started at http://localhost:${port}`);
});
