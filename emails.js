// Initialize EmailJS with your public key
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#contactForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const formData = {
            firstName: document.querySelector('input[placeholder="Ahmed"]').value,
            lastName: document.querySelector('input[placeholder="Mahmoud"]').value,
            email: document.querySelector('input[type="email"]').value,
            phone: document.querySelector('input[type="tel"]').value,
            subject: document.querySelector('select').value,
            message: document.querySelector('textarea').value,
            agreed: document.querySelector('input[type="checkbox"]').checked
        };
        
        // Basic validation
        if (!validateForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            to_email: 'info@vfsa.net', // Your company email
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            reply_to: formData.email
        })
        .then(function(response) {
            // Success
            showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            form.reset();
        })
        .catch(function(error) {
            // Error
            console.error('Failed to send message:', error);
            showNotification('Failed to send message. Please try again or call us directly.', 'error');
        })
        .finally(function() {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Validation function
    function validateForm(data) {
        // Check required fields
        if (!data.firstName || !data.lastName || !data.email || !data.phone || data.subject === 'Select a topic' || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return false;
        }
        
        // Phone validation (basic)
        if (data.phone.length < 10) {
            showNotification('Please enter a valid phone number.', 'error');
            return false;
        }
        
        // Check agreement
        if (!data.agreed) {
            showNotification('Please agree to the Privacy Policy.', 'error');
            return false;
        }
        
        return true;
    }
    
    // Notification function
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.innerHTML = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
});

// File upload handling (optional enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.querySelector('.border-dashed');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    document.body.appendChild(fileInput);
    
    fileUpload.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-red-600', 'bg-red-50');
    });
    
    fileUpload.addEventListener('dragleave', function() {
        this.classList.remove('border-red-600', 'bg-red-50');
    });
    
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-red-600', 'bg-red-50');
        
        const file = e.dataTransfer.files[0];
        if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
            handleFileUpload(file);
        } else {
            showNotification('File too large. Maximum size is 10MB.', 'error');
        }
    });
    
    fileInput.addEventListener('change', function(e) {
        if (this.files[0]) {
            handleFileUpload(this.files[0]);
        }
    });
    
    function handleFileUpload(file) {
        // Display file name
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';
        
        // Update the file upload area
        fileUpload.innerHTML = `
            <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p class="text-sm text-gray-900 font-medium">${fileName}</p>
            <p class="text-xs text-gray-500">${fileSize} • Click to change</p>
        `;
        
        // Store file for later upload
        // Note: You'll need to handle file upload separately with your backend
        console.log('File ready for upload:', file);
    }
});