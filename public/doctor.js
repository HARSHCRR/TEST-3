document.addEventListener('DOMContentLoaded', function() {
    const scanBtn = document.getElementById('scanPatient');
    const scanStatus = document.getElementById('scanStatus');
    const patientResult = document.getElementById('patientResult');
    const patientInfo = document.getElementById('patientInfo');
    const patientsList = document.getElementById('patientsList');
    
    // Load patients on page load
    loadPatients();
    
    // Scan patient functionality
    scanBtn.addEventListener('click', async function() {
        try {
            scanBtn.disabled = true;
            scanBtn.textContent = 'Scanning...';
            scanStatus.textContent = 'Capturing fingerprint...';
            scanStatus.className = 'status-message info';
            patientResult.style.display = 'none';
            
            // Capture fingerprint
            const response = await fetch('/api/captureFingerprint');
            const fingerprintData = await response.json();
            
            if (!response.ok) {
                throw new Error(fingerprintData.error || 'Failed to capture fingerprint');
            }
            
            scanStatus.textContent = 'Searching for patient...';
            
            // Search for patient
            const searchResponse = await fetch('/api/patients/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fingerprintData: JSON.stringify(fingerprintData)
                })
            });
            
            const searchResult = await searchResponse.json();
            
            if (searchResult.found) {
                displayPatientInfo(searchResult.patient);
                scanStatus.textContent = '✅ Patient found!';
                scanStatus.className = 'status-message success';
            } else {
                scanStatus.textContent = '❌ Patient not found in database';
                scanStatus.className = 'status-message error';
                patientResult.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Scan error:', error);
            scanStatus.textContent = '❌ Error: ' + error.message;
            scanStatus.className = 'status-message error';
        } finally {
            scanBtn.disabled = false;
            scanBtn.textContent = '📱 Scan Fingerprint';
        }
    });
    
    // Display patient information
    function displayPatientInfo(patient) {
        patientInfo.innerHTML = `
            <div>
                <strong>Name:</strong>
                <span>${patient.name}</span>
            </div>
            <div>
                <strong>Age:</strong>
                <span>${patient.age} years</span>
            </div>
            <div>
                <strong>Gender:</strong>
                <span>${patient.gender}</span>
            </div>
            <div>
                <strong>Blood Group:</strong>
                <span>${patient.bloodGroup}</span>
            </div>
            <div>
                <strong>Registration Date:</strong>
                <span>${new Date(patient.createdAt).toLocaleDateString()}</span>
            </div>
            ${patient.medicalDocument ? `
            <div>
                <strong>Medical Document:</strong>
                <span>📄 Document uploaded</span>
            </div>
            ` : ''}
        `;
        
        patientResult.style.display = 'block';
    }
    
    // Load all patients
    async function loadPatients() {
        try {
            const response = await fetch('/api/patients');
            const patients = await response.json();
            
            if (patients.length === 0) {
                patientsList.innerHTML = '<p>No patients registered yet.</p>';
                return;
            }
            
            patientsList.innerHTML = patients.map(patient => `
                <div class="patient-card">
                    <h4>${patient.name}</h4>
                    <p><strong>Age:</strong> ${patient.age} years</p>
                    <p><strong>Gender:</strong> ${patient.gender}</p>
                    <p><strong>Blood Group:</strong> ${patient.bloodGroup}</p>
                    <p><strong>Registered:</strong> ${new Date(patient.createdAt).toLocaleDateString()}</p>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading patients:', error);
            patientsList.innerHTML = '<p>Error loading patients. Please try again.</p>';
        }
    }
    
    // Refresh patients list every 30 seconds
    setInterval(loadPatients, 30000);
}); 