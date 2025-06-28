const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://harsh:HALAmadrid@cluster0.jqxvite.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  medicalDocument: { type: String }, // File path
  fingerprintData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/doctor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'doctor.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// API Routes

// Capture fingerprint via local bridge
app.get('/api/captureFingerprint', async (req, res) => {
  try {
    const bridgeUrl = 'http://localhost:4001/bridge/captureFingerprint';
    const response = await axios.get(bridgeUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Fingerprint capture error:', error);
    res.status(500).json({ error: 'Failed to capture fingerprint' });
  }
});

// Register new patient
app.post('/api/patients', upload.single('medicalDocument'), async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, fingerprintData } = req.body;
    
    const patient = new Patient({
      name,
      age: parseInt(age),
      gender,
      bloodGroup,
      medicalDocument: req.file ? req.file.path : '',
      fingerprintData
    });

    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully', patient });
  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ error: 'Failed to register patient' });
  }
});

// Search patient by fingerprint
app.post('/api/patients/search', async (req, res) => {
  try {
    const { fingerprintData } = req.body;
    
    // Simple string comparison for demo purposes
    // In production, use proper fingerprint matching algorithm
    const patient = await Patient.findOne({ fingerprintData });
    
    if (patient) {
      res.json({ found: true, patient });
    } else {
      res.json({ found: false, message: 'Patient not found' });
    }
  } catch (error) {
    console.error('Patient search error:', error);
    res.status(500).json({ error: 'Failed to search patient' });
  }
});

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().select('-fingerprintData');
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Failed to get patients' });
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure the local bridge is running on port 4001');
}); 