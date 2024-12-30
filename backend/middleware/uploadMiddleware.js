import multer from 'multer';
import path from 'path';

// Define storage for the file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Files will be stored in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name based on current timestamp
  },
});

// Filter to only accept .txt files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain') {
    cb(null, true); // Accept .txt files
  } else {
    cb(new Error('Only .txt files are allowed!'), false); // Reject non-.txt files
  }
};

// Initialize multer with the defined storage and filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
});

export default upload;
