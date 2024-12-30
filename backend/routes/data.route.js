import express from 'express';
import upload from '../middleware/uploadMiddleware.js'; // Import the multer middleware
import { addData, getAllData } from '../controllers/data.controller.js'; // Import the controller

const router = express.Router();

// POST route to upload data and file
router.post('/uploaddata', upload.single('dataFile'), addData);
router.get('/getdata', getAllData);


export default router;
