document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('patientForm');
    const captureBtn = document.getElementById('captureFingerprint');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('fingerprintStatus');
    
    let capturedFingerprintData = null;
    
    // Fingerprint capture functionality
    captureBtn.addEventListener('click', async function() {
        try {
            statusDiv.textContent = 'Capturing fingerprint...';
            statusDiv.className = 'status-message info';
            
            const response = await fetch('/api/captureFingerprint');
            const data = await response.json();
            
            if (response.ok) {
                capturedFingerprintData = data;
                statusDiv.textContent = '✅ Fingerprint captured successfully!';
                statusDiv.className = 'status-message success';
                submitBtn.disabled = false;
            } else {
                throw new Error(data.error || 'Failed to capture fingerprint');
            }
        } catch (error) {
            console.error('Fingerprint capture error:', error);
            statusDiv.textContent = '❌ Error: ' + error.message;
            statusDiv.className = 'status-message error';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!capturedFingerprintData) {
            alert('Please capture fingerprint before submitting');
            return;
        }
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            const formData = new FormData(form);
            formData.append('fingerprintData', JSON.stringify(capturedFingerprintData));
            
            const response = await fetch('/api/patients', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('✅ Patient registered successfully!');
                form.reset();
                capturedFingerprintData = null;
                statusDiv.textContent = '';
                statusDiv.className = '';
                submitBtn.disabled = true;
            } else {
                throw new Error(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('❌ Error: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✅ Register Patient';
        }
    });
    
    // Form validation
    const requiredFields = ['name', 'age', 'gender', 'bloodGroup'];
    
    function validateForm() {
        const isValid = requiredFields.every(field => {
            const element = document.getElementById(field);
            return element.value.trim() !== '';
        });
        
        submitBtn.disabled = !isValid || !capturedFingerprintData;
    }
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        element.addEventListener('input', validateForm);
        element.addEventListener('change', validateForm);
    });
    
    // Initial validation
    validateForm();
}); 