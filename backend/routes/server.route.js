import express from "express";
import upload from '../middleware/uploadMiddleware.js'; // Import the multer middleware
import { addServer, getAllServers, installServer, sendEmail, deleteServer } from "../controllers/server.controller.js"; // Adjust the import path
const router = express.Router();

// Route to add a server
router.post("/", addServer);
router.post("/install", installServer);
router.get("/", getAllServers);
router.post("/sendemail", upload.single("file"), sendEmail);
router.delete("/:id", deleteServer);



export default router;
