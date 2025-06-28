# Windows Setup Guide - Healthcare Fingerprint System

## 🪟 Windows Installation & Setup Instructions

### Prerequisites for Windows

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Install with default settings

2. **Git for Windows**
   - Download from: https://git-scm.com/download/win
   - Install with default settings

3. **Mantra RD Service**
   - Download Mantra RD Service for Windows
   - Install and configure for your MFS110 sensor
   - Ensure it runs on `localhost:8080`

4. **Mantra MFS110 Fingerprint Sensor**
   - Connect via USB
   - Install device drivers if prompted

### Step-by-Step Setup

#### 1. Clone the Repository

Open **Command Prompt** or **PowerShell** as Administrator:

```cmd
# Navigate to your desired directory
cd C:\Users\YourUsername\Desktop

# Clone the repository
git clone https://github.com/HARSHCRR/TEST-3.git

# Navigate into the project folder
cd TEST-3
```

#### 2. Install Dependencies

```cmd
# Install Node.js packages
npm install
```

#### 3. Create Required Directories

```cmd
# Create uploads directory
mkdir uploads
```

#### 4. Start the Local Bridge

Open a **new Command Prompt** window:

```cmd
# Navigate to the project directory
cd C:\Users\YourUsername\Desktop\TEST-3

# Start the local bridge
cd backend
node localBridge.js
```

You should see: `Local Bridge running at http://localhost:4001`

#### 5. Start the Main Application

Open **another new Command Prompt** window:

```cmd
# Navigate to the project directory
cd C:\Users\YourUsername\Desktop\TEST-3

# Start the main application
npm start
```

You should see: `Server running on http://localhost:3000`

#### 6. Verify Mantra RD Service

Ensure Mantra RD Service is running on `http://localhost:8080`

### Windows-Specific Commands

#### Using PowerShell (Alternative)

If you prefer PowerShell:

```powershell
# Navigate to project
Set-Location "C:\Users\YourUsername\Desktop\TEST-3"

# Install dependencies
npm install

# Create directory
New-Item -ItemType Directory -Name "uploads"

# Start bridge (in new PowerShell window)
Set-Location "C:\Users\YourUsername\Desktop\TEST-3\backend"
node localBridge.js

# Start main app (in another PowerShell window)
Set-Location "C:\Users\YourUsername\Desktop\TEST-3"
npm start
```

#### Using Windows Terminal (Recommended)

Windows Terminal provides better experience:

1. Install from Microsoft Store
2. Open multiple tabs for different services
3. Run each service in separate tabs

### Troubleshooting Windows Issues

#### Port Already in Use

If you get "port already in use" errors:

```cmd
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :4001
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Node.js Not Found

If `node` or `npm` commands don't work:

1. Restart Command Prompt after Node.js installation
2. Check if Node.js is in PATH:
   ```cmd
   node --version
   npm --version
   ```
3. If not found, reinstall Node.js and check "Add to PATH" option

#### Git Issues

If git commands fail:

```cmd
# Configure git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Firewall Issues

Windows Firewall might block the application:

1. Open Windows Defender Firewall
2. Allow Node.js through firewall
3. Or temporarily disable firewall for testing

#### Antivirus Interference

Some antivirus software may block Node.js:

1. Add project folder to antivirus exclusions
2. Allow Node.js in antivirus settings

### Running as Windows Service (Optional)

For production use, you can run the services as Windows services using tools like:

- **PM2** (recommended)
- **NSSM** (Native Service Manager)
- **Windows Task Scheduler**

#### Using PM2

```cmd
# Install PM2 globally
npm install -g pm2

# Start services with PM2
pm2 start backend/localBridge.js --name "fingerprint-bridge"
pm2 start server.js --name "healthcare-app"

# Save PM2 configuration
pm2 save
pm2 startup
```

### File Paths in Windows

The application uses these Windows paths:

- **Project Root**: `C:\Users\YourUsername\Desktop\TEST-3\`
- **Uploads**: `C:\Users\YourUsername\Desktop\TEST-3\uploads\`
- **Backend**: `C:\Users\YourUsername\Desktop\TEST-3\backend\`

### Browser Access

Once running, access the application at:

- **Main App**: http://localhost:3000
- **Patient Registration**: http://localhost:3000/signup
- **Doctor Dashboard**: http://localhost:3000/doctor

### Windows Performance Tips

1. **Use SSD**: Install on SSD for better performance
2. **Close Unused Apps**: Free up memory for Node.js
3. **Update Drivers**: Keep USB and system drivers updated
4. **Disable Startup Programs**: Reduce system load

### Emergency Commands

If something goes wrong:

```cmd
# Kill all Node.js processes
taskkill /IM node.exe /F

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rmdir /s node_modules
npm install
```

### Support

For Windows-specific issues:

1. Check Windows Event Viewer for errors
2. Run Command Prompt as Administrator
3. Ensure all prerequisites are properly installed
4. Check Windows compatibility mode if needed

---

**Note**: This setup guide is specifically designed for Windows 10/11. For older Windows versions, some commands may vary slightly. 