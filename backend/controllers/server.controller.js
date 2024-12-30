import mongoose from "mongoose";
import Server from "../models/servers.model.js";
import { NodeSSH } from "node-ssh";
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const ssh = new NodeSSH();


// Controller to add a server
export const addServer = async (req, res) => {
    const { name, ipv4_ipv6, username, image, sshPort, password, sshKey, provider } = req.body;
  
    try {
      // Create a new server instance
      const newServer = new Server({
        name,
        ipv4_ipv6,
        username,
        image,
        sshPort,
        password, // Consider hashing the password before saving, if needed
        sshKey,
        provider,
      });
  
      // Save the new server to the database
      await newServer.save();
  
      // Send success response
      return res.status(201).json({
        success: true,
        message: "Server added successfully",
        server: newServer,
      });
    } catch (error) {
      console.error(error);
      // Send error response
      return res.status(500).json({
        success: false,
        message: "Failed to add server",
        error: error.message,
      });
    }
  };

// Controller to delete a server
  export const deleteServer = async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid server ID format",
      });
    }
  
    try {
      // Find the server by id and delete it
      const deletedServer = await Server.findByIdAndDelete(id);
  
      // Check if the server exists
      if (!deletedServer) {
        return res.status(404).json({
          success: false,
          message: "Server not found",
        });
      }
  
      // Send success response
      return res.status(200).json({
        success: true,
        message: "Server deleted successfully",
        server: deletedServer,
      });
    } catch (error) {
      console.error(error);
      // Send error response
      return res.status(500).json({
        success: false,
        message: "Failed to delete server",
        error: error.message,
      });
    }
  };  

// Controller to get all servers
export const getAllServers = async (req, res) => {
    try {
        // Retrieve all servers from the database
        const servers = await Server.find();

        if (!servers.length) {
            return res.status(404).json({
                success: false,
                message: "No servers found",
            });
        }

        // Send the list of servers in the response
        return res.status(200).json({
            success: true,
            servers,
        });
    } catch (error) {
        console.error(error);
        // Send error response if something goes wrong
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve servers",
            error: error.message,
        });
    }
};

// Install a server
export const installServer = async (req, res) => {
  const { ip, username, password, rpmFilePath } = req.body;

  try {
      // Step 1: Connect to the server
      console.log("Connecting to the server...");
      await ssh.connect({
          host: ip,
          username,
          password,
          readyTimeout: 30000,
      });

      console.log("Connected to the server successfully.");

      // Step 2: Ensure 'dnf' is available on the server
      console.log("Checking if 'dnf' is available...");

      const checkDnfCommand = `command -v dnf`;
      const checkDnfResult = await ssh.execCommand(checkDnfCommand);
      
      if (checkDnfResult.stderr) {
        throw new Error("The 'dnf' package manager is not available on this server.");
      }
      
      console.log("'dnf' is available on the server.");
      
      // Perform the update
      const updateCommand = `sudo dnf update -y`;
      let totalProgress = 0;

      console.log("Starting the update...");

      let updateResult = await ssh.execCommand(updateCommand, {
        onStdout: (chunk) => {
          const output = chunk.toString();
          process.stdout.write(output);
      
          // Parse progress if available
          const progressMatch = output.match(/Progress:\s+(\d+)%/);
          if (progressMatch) {
            totalProgress = parseInt(progressMatch[1], 10);
            process.stdout.write(`Progress: ${totalProgress}%\r`);
          }
        },
        onStderr: (chunk) => {
          process.stderr.write(chunk.toString());
        },
      });
      
      // If GPG check fails during the update, handle the error
      if (updateResult.stderr && updateResult.stderr.includes("GPG check FAILED")) {
        console.log("GPG key error detected during update. Importing the AlmaLinux GPG key...");
      
          // Import AlmaLinux GPG key
          const importGpgCommand = `sudo curl -o /etc/pki/rpm-gpg/RPM-GPG-KEY-AlmaLinux https://repo.almalinux.org/almalinux/RPM-GPG-KEY-AlmaLinux`;
          await ssh.execCommand(importGpgCommand);

          // Manually import the GPG key for perl-HTTP-Tiny (CentOS key)
          console.log("Importing GPG key for perl-HTTP-Tiny...");
          const importPerlGpgKeyCommand = `sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-AlmaLinux`;
          await ssh.execCommand(importPerlGpgKeyCommand);

          // Clear the DNF cache to ensure fresh key check
          console.log("Clearing DNF cache...");
          const clearCacheCommand = `sudo dnf clean all`;
          await ssh.execCommand(clearCacheCommand);

          const trustGpgKeyCommand = `sudo dnf makecache`;
          await ssh.execCommand(trustGpgKeyCommand);

          console.log("GPG keys imported and cache cleared. Retrying PowerMTA installation...");
        //  installResult = await ssh.execCommand(updateCommand);  Retry installation
         
        console.log("Retrying server update...");
        updateResult = await ssh.execCommand(updateCommand, {
          onStdout: (chunk) => {
            const output = chunk.toString();
            process.stdout.write(output);
        
            // Parse progress if available
            const progressMatch = output.match(/Progress:\s+(\d+)%/);
            if (progressMatch) {
              totalProgress = parseInt(progressMatch[1], 10);
              process.stdout.write(`Progress: ${totalProgress}%\r`);
            }
          },
          onStderr: (chunk) => {
            process.stderr.write(chunk.toString());
          },
        });       
      
        console.log("Server update completed successfully after retry.");
      } else {
        console.log("Server update completed successfully.");
      }
      
         
      
      // Step 3: Ensure 'unzip' is installed
      console.log("Checking if 'unzip' is installed on the server...");
      const checkUnzipCommand = `which unzip`;
      const unzipCheckResult = await ssh.execCommand(checkUnzipCommand);
      
      if (unzipCheckResult.stderr || !unzipCheckResult.stdout) {
        console.log("'unzip' is not installed. Installing it...");
        
        // Command to install unzip
        const installUnzipCommand = `sudo dnf install -y unzip`;
        const installUnzipResult = await ssh.execCommand(installUnzipCommand);
      
        if (installUnzipResult.stderr) {
          console.error("Failed to install 'unzip'. Error: ", installUnzipResult.stderr);
          throw new Error("Failed to install 'unzip'. Please check the error message.");
        }
      
        console.log("'unzip' has been installed successfully.");
      } else {
        console.log("'unzip' is available on the server.");
      }
      
  
      // Step 4: Upload ZIP file to the server
      const remoteZipPath = "/tmp/pmta/rpms.zip";
      const zipFilePath = path.resolve(__dirname, 'tmp', 'rpms.zip');
      const remoteRpmPath = "/tmp/pmta/rpms/pmta64.rpm";
      const localZipFilePath = zipFilePath;
  
      console.log("Creating /tmp/pmta directory...");
      await ssh.execCommand("mkdir -p /tmp/pmta/");
  
      console.log("Checking if ZIP file already exists...");
      const checkFileCommand = `[ -f "${remoteZipPath}" ] && echo "exists" || echo "not found"`;
      const checkFileResult = await ssh.execCommand(checkFileCommand);
  
      if (checkFileResult.stdout.trim() === "exists") {
        console.log("ZIP file already exists on the server. Skipping upload.");
      } else {
        console.log("Uploading ZIP file to the server...");
        await ssh.putFile(localZipFilePath, remoteZipPath, null, {
          concurrency: 1,
          step: (transferred, chunk, total) => {
              process.stdout.write(`Progress: ${((transferred / total) * 100).toFixed(2)}%\r`);
          },
      });
        console.log("ZIP file uploaded successfully.");
      }
  
      // Step 5: Extract ZIP file
      console.log("Extracting the ZIP file...");
      const extractCommand = `
        unzip -o ${remoteZipPath} -d /tmp/pmta/ &&
        rm -f ${remoteZipPath}
      `;
      const extractResult = await ssh.execCommand(extractCommand);
      if (extractResult.stderr) {
        throw new Error(`Error extracting ZIP file: ${extractResult.stderr}`);
      }
      console.log("ZIP file extracted successfully.");

      // Step 4: Remove any older PowerMTA installations
      console.log("Removing any existing PowerMTA installations...");
      const removeOldPmtaCommand = `sudo dnf remove -y powermta`;
      const removeOldPmtaResult = await ssh.execCommand(removeOldPmtaCommand);

      if (removeOldPmtaResult.stderr) {
          console.warn(`Warning: Issue removing old PowerMTA (if installed): ${removeOldPmtaResult.stderr}`);
      } else {
          console.log("Old PowerMTA installations removed successfully.");
      }

      // Step 5: Install PowerMTA 4 from the new RPM file
      console.log("Installing PowerMTA 4...");
      const installCommand = `sudo dnf install -y ${remoteRpmPath}`;
      let installResult = await ssh.execCommand(installCommand);

      if (installResult.stderr) {
          throw new Error(`Error installing PowerMTA: ${installResult.stderr}`);
      }
      console.log("PowerMTA 4 installed successfully.");

      // Step 6: Copy license and config files to `/etc/pmta/`
      console.log("Copying license and config files to /etc/pmta/...");
      const copyFilesCommand = `
          sudo mkdir -p /etc/pmta &&
          sudo cp /tmp/pmta/rpms/license /etc/pmta/ &&
          sudo cp /tmp/pmta/rpms/config /etc/pmta/
      `;
      const copyFilesResult = await ssh.execCommand(copyFilesCommand);

      if (copyFilesResult.stderr) {
          throw new Error(`Error copying license or config files: ${copyFilesResult.stderr}`);
      }
      console.log("License and config files copied successfully to /etc/pmta/.");
      // Step 7: open ports in case
      const portscmd = `
          sudo firewall-cmd --add-port=8080/tcp --add-port=587/tcp --add-port=465/tcp --permanent &&
          sudo firewall-cmd --reload
      `;     
      const portsresult = await ssh.execCommand(portscmd);
      console.log("Firewall configured --add-port={0/0}/tcp");

      if (portsresult.stderr && !portsresult.stderr.includes("ALREADY_ENABLED")) {
        throw new Error(`Error in Firewall services: ${portsresult.stderr}`);
      } else if (portsresult.stderr) {
            console.warn(`Firewall configuration warnings: ${portsresult.stderr}`);
      }
        
      console.log("Firewall configured successfully.");
      

      // Step 8: Restart PowerMTA services
      console.log("Restarting PowerMTA services...");
      const restartCommands = `
          sudo systemctl restart pmta &&
          sudo systemctl restart pmtahttp
      `;
      const restartResult = await ssh.execCommand(restartCommands);

      if (restartResult.stderr) {
          throw new Error(`Error restarting PowerMTA services: ${restartResult.stderr}`);
      }
      console.log("PowerMTA services restarted successfully.");

      // Step 8: Return success response
      return res.status(200).json({
          success: true,
          message: "PowerMTA 4 installed, configured, and services restarted successfully on AlmaLinux 8.10.",
      });
  } catch (error) {
      console.error("Error during installation:", error.message);

      return res.status(500).json({
          success: false,
          message: "Failed to install, configure, or restart PowerMTA 4 services on AlmaLinux 8.10.",
          error: error.message,
      });
  } finally {
      // Close the SSH connection
      ssh.dispose();
  }
};

// Send Email
export const sendEmail = async (req, res) => {
  const {
    from,
    to,
    subject,
    body,
    servers,
    messageId,
    contentType,
    mimeVersion,
    sender,
    textHeaders = {},
    returnPath,
  } = req.body;

  if (!servers || servers.length === 0) {
    return res.status(400).send({ error: "No servers selected." });
  }

  // Default SMTP settings
  const defaultSmtpUser = "root"; // Replace with your SMTP username
  const defaultSmtpPass = "123456"; // Replace with your SMTP password
  const defaultSmtpPort = 587; // Adjust based on SMTP server configuration

  try {
    let recipients = [];

    // Check if recipients are provided in the `to.inputparam` field
    if (to && typeof to === "object" && to.inputparam) {
      recipients.push(to.inputparam.trim());
    }

    // Parse recipients from the file path in `to.recipient` if provided
    if (to && to.recipient) {
      const filePath = path.resolve(to.recipient); // Resolve the file path
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const fileEmails = fileContent
          .split(/\r?\n/)
          .map(email => email.trim())
          .filter(email => email); // Filter empty or invalid emails
        recipients.push(...fileEmails);
      } else {
        console.error("Recipient file not found:", filePath);
      }
    }

    // Remove duplicate email addresses
    recipients = [...new Set(recipients)];
    console.log("Final Recipient List:", recipients);

    if (recipients.length === 0) {
      return res.status(400).send({ error: "No valid email addresses provided." });
    }


    // Send emails via each selected SMTP server
    for (const server of servers) {
      const { ip, name } = server;

      const transporter = nodemailer.createTransport({
        host: ip,
        port: defaultSmtpPort,
        secure: defaultSmtpPort === 465, // Use secure connection for port 465
        auth: {
          user: defaultSmtpUser,
          pass: defaultSmtpPass,
        },
      });

      // Send an email to each recipient
      for (const recipient of recipients) {
        const customHeaders = {
          "Message-ID": messageId || "default-message-id@email.com",
          "Content-Type": contentType || "text/plain; charset=UTF-8",
          "MIME-Version": mimeVersion || "1.0",
          "Sender": sender || from,
          "Return-Path": returnPath || from,
          ...textHeaders, // Spread additional headers
        };

        const mailOptions = {
          from,
          to: recipient,
          subject,
          text: body,
          headers: customHeaders,
        };

        try {
          const result = await transporter.sendMail(mailOptions);
          console.log(`Email sent via ${name} (${ip}) to ${recipient}:`, result);
        } catch (sendError) {
          console.error(`Failed to send email to ${recipient} via ${name}:`, sendError);
        }
      }
    }

    res.send({ success: true, message: "Emails sent successfully." });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send({ error: "Error sending emails." });
  }
};












