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

// =================== NAVBAR FUNCTIONALITY ===================

// Create missing sections for navbar links
function createMissingSections() {
    const container = document.querySelector('.container');
    
    // How It Works Section
    if (!document.getElementById('how-it-works')) {
        const howItWorksSection = document.createElement('section');
        howItWorksSection.id = 'how-it-works';
        howItWorksSection.className = 'features-section';
        howItWorksSection.innerHTML = `
            <h2 class="section-title">How It Works</h2>
            <div class="features">
                <div class="feature-card">
                    <i class="fas fa-upload"></i>
                    <h3>1. Upload Your Image</h3>
                    <p>Drag & drop or select an image from your device. We support JPG, PNG, and WEBP formats up to 10MB.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-cogs"></i>
                    <h3>2. AI Processing</h3>
                    <p>Our AI analyzes your image and enhances it using advanced neural networks to upscale up to 4x.</p>
                </div>
                <div class="feature-card">
                    <i class="fas fa-download"></i>
                    <h3>3. Download Result</h3>
                    <p>Download your enhanced image with improved resolution, clarity, and detail.</p>
                </div>
            </div>
        `;
        // Insert after comparison section
        const comparisonSection = document.getElementById('comparison');
        container.insertBefore(howItWorksSection, comparisonSection.nextSibling);
    }
    
    // Pricing Section
    if (!document.getElementById('pricing')) {
        const pricingSection = document.createElement('section');
        pricingSection.id = 'pricing';
        pricingSection.className = 'features-section';
        pricingSection.innerHTML = `
            <h2 class="section-title">Pricing Plans</h2>
            <div class="features">
                <div class="feature-card">
                    <h3>Free Plan</h3>
                    <div style="font-size: 2rem; color: var(--accent); margin: 20px 0;">$0</div>
                    <ul style="text-align: left; padding-left: 20px; color: var(--text-secondary);">
                        <li>Up to 5 images per day</li>
                        <li>2x upscaling</li>
                        <li>Basic enhancement</li>
                        <li>Watermark on results</li>
                    </ul>
                    <button class="btn btn-outline" style="margin-top: 20px; width: 100%;">Select Free</button>
                </div>
                <div class="feature-card" style="border-color: var(--accent); transform: scale(1.05);">
                    <h3>Pro Plan</h3>
                    <div style="font-size: 2rem; color: var(--accent); margin: 20px 0;">$9.99/month</div>
                    <ul style="text-align: left; padding-left: 20px; color: var(--text-secondary);">
                        <li>Unlimited images</li>
                        <li>4x upscaling</li>
                        <li>Advanced AI enhancement</li>
                        <li>No watermark</li>
                        <li>Priority processing</li>
                    </ul>
                    <button class="btn btn-primary" style="margin-top: 20px; width: 100%;">Get Started</button>
                </div>
                <div class="feature-card">
                    <h3>Student Plan</h3>
                    <div style="font-size: 2rem; color: var(--accent); margin: 20px 0;">$4.99/month</div>
                    <ul style="text-align: left; padding-left: 20px; color: var(--text-secondary);">
                        <li>Up to 20 images per day</li>
                        <li>4x upscaling</li>
                        <li>Advanced enhancement</li>
                        <li>No watermark</li>
                        <li>Student verification required</li>
                    </ul>
                    <button class="btn btn-outline" style="margin-top: 20px; width: 100%;">Select Student</button>
                </div>
            </div>
        `;
        // Insert before footer
        const footer = document.querySelector('footer');
        container.insertBefore(pricingSection, footer);
    }
    
    // Examples Section
    if (!document.getElementById('examples')) {
        const examplesSection = document.createElement('section');
        examplesSection.id = 'examples';
        examplesSection.className = 'features-section';
        examplesSection.innerHTML = `
            <h2 class="section-title">Example Results</h2>
            <div style="text-align: center; margin-bottom: 40px;">
                <p style="color: var(--text-secondary); max-width: 800px; margin: 0 auto 30px;">
                    See how our AI upscaler transforms different types of images
                </p>
            </div>
            <div class="features">
                <div class="feature-card">
                    <h3>Portrait Enhancement</h3>
                    <p style="color: var(--text-secondary);">Facial details become sharper while maintaining natural skin texture.</p>
                    <div style="height: 200px; background: var(--secondary); border-radius: 8px; margin-top: 15px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        <i class="fas fa-user" style="font-size: 3rem;"></i>
                    </div>
                </div>
                <div class="feature-card">
                    <h3>Landscape Photos</h3>
                    <p style="color: var(--text-secondary);">Nature scenes gain incredible detail in trees, mountains, and water.</p>
                    <div style="height: 200px; background: var(--secondary); border-radius: 8px; margin-top: 15px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        <i class="fas fa-mountain" style="font-size: 3rem;"></i>
                    </div>
                </div>
                <div class="feature-card">
                    <h3>Digital Art</h3>
                    <p style="color: var(--text-secondary);">Artwork is upscaled without losing artistic style or introducing artifacts.</p>
                    <div style="height: 200px; background: var(--secondary); border-radius: 8px; margin-top: 15px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                        <i class="fas fa-palette" style="font-size: 3rem;"></i>
                    </div>
                </div>
            </div>
        `;
        // Insert before pricing section if exists, otherwise before footer
        const pricingSection = document.getElementById('pricing');
        const footer = document.querySelector('footer');
        if (pricingSection) {
            container.insertBefore(examplesSection, pricingSection);
        } else {
            container.insertBefore(examplesSection, footer);
        }
    }
    
    // About Section
    if (!document.getElementById('about')) {
        const aboutSection = document.createElement('section');
        aboutSection.id = 'about';
        aboutSection.className = 'upload-section';
        aboutSection.style.marginTop = '40px';
        aboutSection.innerHTML = `
            <h2><i class="fas fa-info-circle"></i> About This Project</h2>
            <div style="line-height: 1.8; color: var(--text-secondary);">
                <p>This AI Image Upscaler is a university project developed for the Computer Science department.</p>
                <p><strong>Technologies Used:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 20px;">
                    <li>Frontend: HTML5, CSS3, JavaScript (ES6+)</li>
                    <li>Backend: Node.js with Express</li>
                    <li>API Integration: FreePic Image Enhancer API</li>
                    <li>Deployment: Vercel Platform</li>
                </ul>
                <p><strong>Project Goals:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 20px;">
                    <li>Demonstrate AI integration in web applications</li>
                    <li>Implement responsive web design principles</li>
                    <li>Create a user-friendly image processing interface</li>
                    <li>Showcase modern web development practices</li>
                </ul>
                <p>This project serves as a demonstration of how AI can be integrated into practical web applications to solve real-world problems like image quality enhancement.</p>
            </div>
        `;
        // Insert before footer
        const footer = document.querySelector('footer');
        container.insertBefore(aboutSection, footer);
    }
}

// Function to scroll to section smoothly
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Smooth scroll
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize navbar functionality
function initNavbar() {
    console.log('Initializing navbar functionality...');
    
    // Create missing sections first
    createMissingSections();
    
    // Get all navbar links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add click events to navbar links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
    
    // Make footer links work
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.toLowerCase();
            
            if (linkText.includes('home')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.querySelectorAll('.nav-links a').forEach(navLink => {
                    navLink.classList.remove('active');
                    if (navLink.textContent.toLowerCase().includes('home')) {
                        navLink.classList.add('active');
                    }
                });
            } else if (linkText.includes('how it works')) {
                scrollToSection('how-it-works');
            } else if (linkText.includes('api')) {
                alert('API documentation would open in a new tab in a real implementation.');
            } else if (linkText.includes('privacy')) {
                alert('Privacy policy page would open in a real implementation.');
            }
        });
    });
    
    // Make pricing buttons work
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn') && 
            (e.target.textContent.includes('Select') || e.target.textContent.includes('Get Started'))) {
            e.preventDefault();
            const plan = e.target.closest('.feature-card').querySelector('h3').textContent;
            showNotification(`Selected ${plan} plan! In a real implementation, this would proceed to checkout.`, 'success');
        }
    });
}

// =================== MAIN APPLICATION FUNCTIONALITY ===================

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
    
    // Initialize navbar functionality
    initNavbar();
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
            scrollToSection('upload');
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
        // Send to backend API
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
        window.open(downloadUrl, '_blank');
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
    
    // Create a canvas to simulate enhancement
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = lowImg.naturalWidth * 2; // Simulate 2x upscale
    canvas.height = lowImg.naturalHeight * 2;
    
    // Draw original image scaled up
    ctx.drawImage(lowImg, 0, 0, canvas.width, canvas.height);
    
    // Apply some filters to simulate enhancement
    ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
    ctx.drawImage(lowImg, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL and set as enhanced image
    const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    highImg.src = enhancedDataUrl;
    
    // Enable download button for simulated image
    createDownloadButton(enhancedDataUrl);
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
    showNotification('Login successful! (Demo mode)', 'success');
    
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
    showNotification('Registration successful! Welcome to AI Upscaler. (Demo mode)', 'success');
    
    // Close modal
    if (registerModal) registerModal.classList.remove('active');
}

// =================== INITIALIZE THE APP ===================

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
