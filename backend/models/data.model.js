import mongoose from 'mongoose';

// Define the schema for the data
const dataSchema = new mongoose.Schema(
  {
    dataName: {
      type: String,
      required: true,
    },
    geography: {
      type: String,
      required: true,
    },
    dataFile: {
      type: String, // This will store the file path or URL of the uploaded file
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set the current date
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the model based on the schema
const Data = mongoose.model('Data', dataSchema);

export default Data;
