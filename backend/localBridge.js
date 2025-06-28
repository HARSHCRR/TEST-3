/**
 * Updated bridge: RD Service now runs on localhost:8080 (not 11100)
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4001; // Local bridge port

app.use(cors());
app.use(express.json());

// === Capture Fingerprint ===
app.get('/bridge/captureFingerprint', async (req, res) => {
  try {
    const rdUrl = 'http://127.0.0.1:8080/rd/capture';

    const pidOptions = `<?xml version='1.0' encoding='UTF-8'?>
      <PidOptions ver="1.0">
        <Opts fCount="1" fType="0" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="20000" otp="" wadh="" posh=""/>
      </PidOptions>`;

    const response = await axios.post(rdUrl, pidOptions, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });

    const pidData = response.data;
    res.send(pidData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to capture fingerprint.' });
  }
});

app.listen(PORT, () => {
  console.log(`Local Bridge running at http://localhost:${PORT}`);
});

/**
 * Usage:
 * 1. Run Mantra RD Service on port 8080.
 * 2. Run this bridge: `node localBridge.js`
 * 3. Browser calls: http://localhost:4001/bridge/captureFingerprint
 */ 