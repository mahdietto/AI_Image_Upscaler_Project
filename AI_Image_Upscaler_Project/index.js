// Vercel deployment - API is at /api/upload
const API_BASE_URL = window.location.origin;

// Elements
const comp = document.getElementById('comp');
const bar = document.getElementById('bar');
const high = document.getElementById('highImg');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileDimensions = document.getElementById('fileDimensions');
const processBtn = document.getElementById('processBtn');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const startUpscalingBtn = document.getElementById('startUpscaling');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Global variables
let pos = 50;
let auto = true;
let dir = 1;
let dragging = false;
let selectedFile = null;

// Initialize the application
function init() {
    console.log('AI Image Upscaler initialized');
    
    // Check if all required elements exist
    if (!comp || !bar || !high) {
        console.error('Critical elements not found. Check your HTML structure.');
        return;
    }
    
    // Initialize slider
    applyPos();
    requestAnimationFrame(loop);
    
    // Set up event listeners
    setupEventListeners();
}

// Apply position to slider
function applyPos() {
    if (bar) bar.style.left = pos + '%';
    if (high) high.style.clipPath = `polygon(${pos}% 0, 100% 0, 100% 100%, ${pos}% 100%)`;
}

// Auto animation loop
function loop() {
    if (auto && !dragging) {
        pos += dir * 0.25;
        if (pos >= 94) { pos = 94; dir = -1; }
        if (pos <= 6) { pos = 6; dir = 1; }
        applyPos();
    }
    requestAnimationFrame(loop);
}

// Set up all event listeners
function setupEventListeners() {
    // Slider interaction
    if (comp) {
        comp.addEventListener('mouseenter', () => auto = false);
        comp.addEventListener('mouseleave', () => auto = true);
    }

    // Mouse dragging for slider
    if (bar) {
        bar.addEventListener('mousedown', (e) => { 
            dragging = true; 
            e.preventDefault(); 
        });
    }

    window.addEventListener('mouseup', () => dragging = false);
    
    window.addEventListener('mousemove', (e) => {
        if (!dragging || !comp) return;
        const r = comp.getBoundingClientRect();
        let x = e.clientX - r.left;
        pos = Math.max(0, Math.min(100, (x / r.width) * 100));
        applyPos();
    });

    // Touch support
    if (bar) {
        bar.addEventListener('touchstart', () => dragging = true);
    }
    
    window.addEventListener('touchend', () => dragging = false);
    
    window.addEventListener('touchmove', (e) => {
        if (!dragging || !comp) return;
        const touch = e.touches[0];
        const r = comp.getBoundingClientRect();
        let x = touch.clientX - r.left;
        pos = Math.max(0, Math.min(100, (x / r.width) * 100));
        applyPos();
    }, { passive: false });

    // Prevent mobile bounce while dragging
    if (comp) {
        comp.addEventListener('touchmove', (e) => { 
            if (dragging) e.preventDefault(); 
        }, { passive: false });
    }

    // File upload handling
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--accent)';
            uploadArea.style.background = 'rgba(0, 194, 255, 0.08)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border)';
            uploadArea.style.background = 'rgba(0, 194, 255, 0.02)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border)';
            uploadArea.style.background = 'rgba(0, 194, 255, 0.02)';
            
            if (e.dataTransfer.files.length) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    // Process button click
    if (processBtn) {
        processBtn.addEventListener('click', handleProcessClick);
    }

    // Start upscaling button
    if (startUpscalingBtn) {
        startUpscalingBtn.addEventListener('click', () => {
            const uploadSection = document.querySelector('.upload-section');
            if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Modal handling
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.classList.add('active');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (registerModal) registerModal.classList.add('active');
        });
    }
    
    if (closeLogin) {
        closeLogin.addEventListener('click', () => {
            if (loginModal) loginModal.classList.remove('active');
        });
    }
    
    if (closeRegister) {
        closeRegister.addEventListener('click', () => {
            if (registerModal) registerModal.classList.remove('active');
        });
    }
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginModal) loginModal.classList.remove('active');
            if (registerModal) registerModal.classList.add('active');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerModal) registerModal.classList.remove('active');
            if (loginModal) loginModal.classList.add('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
        }
    });

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

// Handle file selection with API integration
function handleFileSelect(file) {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, or WEBP)');
        return;
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit');
        return;
    }
    
    // Update file info display
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);
    
    // Create a temporary image to get dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = function() {
        if (fileDimensions) {
            fileDimensions.textContent = `${this.naturalWidth} x ${this.naturalHeight}`;
        }
        URL.revokeObjectURL(objectUrl);
        
        // Show file info and process button
        if (fileInfo) fileInfo.classList.add('show');
        if (processBtn) processBtn.classList.add('show');
        
        // Store the file for processing
        selectedFile = file;
        
        // Preview the image in comparison slider
        previewImage(file);
    };
    
    img.src = objectUrl;
}

// Preview image in comparison slider
function previewImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Update both images in the comparison slider
        const lowImg = document.querySelector('.low-img');
        const highImg = document.querySelector('.high-img');
        
        if (lowImg) lowImg.src = imageUrl;
        if (highImg) highImg.src = imageUrl; // Initially same, will be replaced after enhancement
    };
    
    reader.readAsDataURL(file);
}

// Handle process button click with API integration
async function handleProcessClick() {
    if (!selectedFile) {
        alert('Please select an image first');
        return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    // Update button state
    if (processBtn) {
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        processBtn.disabled = true;
    }
    
    try {
        // Send to backend API - wrap in async/await
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showNotification('Image processing simulated for demo. In production, this would enhance the image.', 'success');
            
            // For demo: simulate enhancement
            simulateEnhancement();
        } else {
            throw new Error(result.error || 'Processing failed');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification(`Demo mode: Using simulated enhancement.`, 'info');
        
        // Fallback: Use simulated enhancement
        simulateEnhancement();
    } finally {
        // Reset button state
        if (processBtn) {
            processBtn.innerHTML = 'Upscale Image with AI';
            processBtn.disabled = false;
        }
    }
}

// Create download button for enhanced image
function createDownloadButton(downloadUrl) {
    // Remove existing download button if any
    const existingBtn = document.querySelector('.download-btn');
    if (existingBtn) existingBtn.remove();
    
    // Create new download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn btn-primary download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Enhanced Image';
    downloadBtn.style.marginTop = '20px';
    downloadBtn.style.width = '100%';
    
    downloadBtn.addEventListener('click', () => {
        // Create a temporary anchor element
        const link = document.createElement('a');
        
        // Generate a filename
        const timestamp = new Date().getTime();
        const filename = `enhanced-image-${timestamp}.jpg`;
        
        // Set download attributes
        link.download = filename;
        link.href = downloadUrl;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Add button after process button
    if (processBtn && processBtn.parentNode) {
        processBtn.parentNode.insertBefore(downloadBtn, processBtn.nextSibling);
    }
}

// Simulated enhancement for demo purposes
function simulateEnhancement() {
    const lowImg = document.querySelector('.low-img');
    const highImg = document.querySelector('.high-img');
    
    if (!lowImg || !highImg) return;
    
    // Wait for image to load completely
    if (!lowImg.complete || lowImg.naturalWidth === 0) {
        lowImg.onload = () => simulateEnhancement();
        return;
    }
    
    // Create a canvas to simulate enhancement
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate dimensions (2x upscale)
    const originalWidth = lowImg.naturalWidth;
    const originalHeight = lowImg.naturalHeight;
    canvas.width = originalWidth * 2;
    canvas.height = originalHeight * 2;
    
    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw original image scaled up
    ctx.drawImage(lowImg, 0, 0, canvas.width, canvas.height);
    
    // Apply some filters to simulate enhancement
    ctx.filter = 'contrast(1.05) brightness(1.03) saturate(1.05)';
    ctx.drawImage(canvas, 0, 0);
    
    // Convert to data URL with good quality
    const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Set as enhanced image
    highImg.src = enhancedDataUrl;
    
    // Enable download button for simulated image
    createDownloadButton(enhancedDataUrl);
    
    // Show success notification
    showNotification('Image enhanced successfully! Ready to download.', 'success');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';
    notification.style.minWidth = '300px';
    notification.style.maxWidth = '400px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    
    // Set color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00b09b, #96c93d)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #00c2ff, #7a5fff)';
    }
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = '15px';
    
    // Add close functionality
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Add to document
    document.body.appendChild(notification);
}

// Handle login form submission
function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // In a real implementation, this would validate with a backend
    console.log('Login attempt:', email, password);
    showNotification('Login functionality would be connected to a backend in a real implementation.', 'info');
    
    // Close modal
    if (loginModal) loginModal.classList.remove('active');
}

// Handle register form submission
function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simple validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // In a real implementation, this would send data to a backend
    console.log('Registration attempt:', name, email);
    showNotification('Registration functionality would be connected to a backend in a real implementation.', 'info');
    
    // Close modal
    if (registerModal) registerModal.classList.remove('active');
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


//fedsc