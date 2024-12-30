import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ipv4_ipv6: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    sshPort: {
      type: Number,
      required: true,
      default: 22, // Default SSH port, can be customized
    },
    password: {
      type: String, // Store password in a hashed form
      required: false, // Optional field, can be replaced by key
    },
    sshKey: {
      type: String, // Store SSH key (could be a file path or key content)
      required: false, // Optional field, can be replaced by password
    },
    date: {
      type: Date,
      default: Date.now, // Automatically sets the current date
    },
    provider: {
      type: String,
      required: true, // Required field for the provider (e.g., AWS, DigitalOcean, etc.)
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

const Server = mongoose.model("Server", serverSchema);

export default Server;
