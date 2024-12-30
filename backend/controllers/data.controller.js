import Data from '../models/data.model.js'; // Import the Data model

// Controller method to add data
export const addData = async (req, res) => {
  try {
    const { dataName, geography } = req.body;
    const dataFile = req.file ? req.file.path : null; // Get file path from multer

    if (!dataName || !geography || !dataFile) {
      return res.status(400).json({ message: 'Missing required fields: dataName, geography, or dataFile.' });
    }

    // Create a new Data document
    const newData = new Data({
      dataName,
      geography,
      dataFile,
    });

    // Save the new data to the database
    await newData.save();

    // Return success response
    res.status(201).json({ message: 'Data uploaded successfully', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading data', error: error.message });
  }
};

// Controller method to get all data
export const getAllData = async (req, res) => {
  try {
    // Retrieve all documents from the Data collection
    const data = await Data.find();

    // Return the data in the response
    res.status(200).json({
      message: 'Data retrieved successfully',
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error retrieving data',
      error: error.message,
    });
  }
};