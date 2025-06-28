# Healthcare Fingerprint System

A secure patient management system with biometric authentication using Mantra MFS110 fingerprint sensor.

## Features

- **Patient Registration**: Register patients with personal information and fingerprint
- **Doctor Dashboard**: Search patients by fingerprint scan
- **MongoDB Integration**: Secure data storage
- **Fingerprint Authentication**: Biometric patient identification
- **Document Upload**: Medical document management
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (cloud or local)
3. **Mantra RD Service** running on localhost:8080
4. **Mantra MFS110 Fingerprint Sensor** connected to your system

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create uploads directory**:
   ```bash
   mkdir uploads
   ```

## Setup Instructions

### 1. Start the Local Bridge

The local bridge connects your application to the Mantra RD Service:

```bash
cd backend
node localBridge.js
```

This will start the bridge on `http://localhost:4001`

### 2. Start the Main Application

In a new terminal window:

```bash
npm start
```

The application will run on `http://localhost:3000`

### 3. Ensure Mantra RD Service is Running

Make sure the Mantra RD Service is running on `http://localhost:8080` with your MFS110 sensor connected.

## Usage

### Patient Registration

1. Navigate to `http://localhost:3000/signup`
2. Fill in patient information:
   - Full Name
   - Age
   - Gender
   - Blood Group
   - Upload medical document (optional)
3. Click "Capture Fingerprint" to scan the patient's fingerprint
4. Click "Register Patient" to save the information

### Doctor Dashboard

1. Navigate to `http://localhost:3000/doctor`
2. Click "Scan Fingerprint" to identify a patient
3. If a match is found, patient information will be displayed
4. View all registered patients in the list below

## File Structure

```
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── backend/
│   └── localBridge.js       # Mantra RD Service bridge
├── public/
│   ├── index.html           # Landing page
│   ├── signup.html          # Patient registration
│   ├── doctor.html          # Doctor dashboard
│   ├── styles.css           # CSS styles
│   ├── signup.js            # Registration logic
│   └── doctor.js            # Dashboard logic
├── uploads/                 # Medical document storage
└── README.md               # This file
```

## API Endpoints

- `GET /api/captureFingerprint` - Capture fingerprint via sensor
- `POST /api/patients` - Register new patient
- `POST /api/patients/search` - Search patient by fingerprint
- `GET /api/patients` - Get all patients

## Database Schema

```javascript
Patient {
  name: String (required)
  age: Number (required)
  gender: String (required)
  bloodGroup: String (required)
  medicalDocument: String (file path)
  fingerprintData: String (required)
  createdAt: Date
}
```

## Troubleshooting

### Fingerprint Sensor Issues

1. **Sensor not detected**: Ensure Mantra RD Service is running on port 8080
2. **Connection failed**: Check if the local bridge is running on port 4001
3. **Capture timeout**: Make sure the sensor is properly connected and the finger is placed correctly

### MongoDB Connection Issues

1. **Connection failed**: Verify the MongoDB connection string in `server.js`
2. **Authentication error**: Check username and password in the connection string

### CORS Issues

The application is configured to handle CORS properly. If you encounter issues:
1. Ensure all services are running on the correct ports
2. Check browser console for specific error messages

## Security Notes

- This is a testing application with minimal security measures
- In production, implement proper authentication and authorization
- Use HTTPS for secure data transmission
- Implement proper fingerprint matching algorithms
- Add input validation and sanitization

## Development

To run in development mode with auto-restart:

```bash
npm run dev
```

## License

This project is for testing purposes only.

## Support

For issues related to:
- **Mantra Sensor**: Contact Mantra Softech support
- **Application**: Check the console logs for error messages
- **MongoDB**: Verify your connection string and network access 