// Konfigurasi
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9hBJ56ddautD5IUd4YI9LDzcNVdV_l_syLk7G20TmloDHYuGMtQCiStikHIUXakk73g/exec';

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll) library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }

    // Theme toggle functionality
    initThemeToggle();
    
    // Initialize loader for assignment cards
    initLoader();
    
    // Initialize GitHub form handling
    initGitHubForm();
    
    // Initialize modal handling
    initModal();
});

// Theme toggle functionality - Dark mode default
function initThemeToggle() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.fa-sun');
    const moonIcon = document.querySelector('.fa-moon');
    const themeLabel = document.querySelector('.theme-label');
    
    // Check for saved theme preference, but default to dark mode if not set
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        moonIcon.classList.remove('active');
        sunIcon.classList.add('active');
        themeLabel.textContent = 'Mode Terang';
    } else {
        // Ensure dark mode is set as default
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        sunIcon.classList.remove('active');
        moonIcon.classList.add('active');
        themeLabel.textContent = 'Mode Gelap';
        localStorage.setItem('theme', 'dark');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            // Switch to light mode
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            moonIcon.classList.remove('active');
            sunIcon.classList.add('active');
            themeLabel.textContent = 'Mode Terang';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark mode
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            sunIcon.classList.remove('active');
            moonIcon.classList.add('active');
            themeLabel.textContent = 'Mode Gelap';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Enhanced loader functionality
function initLoader() {
    const assignmentCards = document.querySelectorAll('.assignment-card');
    const loaderOverlay = document.getElementById('loaderOverlay');
    
    assignmentCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const link = card.querySelector('a');
            if (link && link.href) {
                e.preventDefault();
                showLoader();
                
                // Navigate to the link after showing loader
                setTimeout(() => {
                    window.location.href = link.href;
                }, 800);
            }
        });
    });
}

function showLoader() {
    const loaderOverlay = document.getElementById('loaderOverlay');
    
    if (loaderOverlay) {
        loaderOverlay.classList.add('show');
        
        // Safety timeout to hide loader if something goes wrong
        setTimeout(() => {
            loaderOverlay.classList.remove('show');
        }, 5000);
    }
}

// GitHub form handling
function initGitHubForm() {
    const githubForm = document.getElementById('githubForm');
    
    if (githubForm) {
        githubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Show loader
                showLoader();
                
                // Submit data to Google Sheet
                submitToGoogleSheet();
            }
        });
    }
}

// Form validation
function validateForm() {
    const mataKuliah = document.getElementById('mata_kuliah');
    const kelompok = document.getElementById('kelompok');
    const anggota = document.getElementById('anggota');
    const githubLink = document.getElementById('github_link');
    
    // Simple validation
    if (!mataKuliah.value) {
        showError(mataKuliah, 'Silakan pilih mata kuliah');
        return false;
    }
    
    if (!kelompok.value) {
        showError(kelompok, 'Silakan pilih kelompok');
        return false;
    }
    
    if (!anggota.value.trim()) {
        showError(anggota, 'Silakan masukkan anggota kelompok');
        return false;
    }
    
    if (!githubLink.value.trim()) {
        showError(githubLink, 'Silakan masukkan link GitHub');
        return false;
    }
    
    // Validate GitHub URL format
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w\-]+\/[\w\-]+\/?$/;
    if (!githubPattern.test(githubLink.value)) {
        showError(githubLink, 'Format link GitHub tidak valid');
        return false;
    }
    
    // Clear any previous errors
    clearErrors();
    
    return true;
}

// Show error message
function showError(inputElement, message) {
    // Clear any previous errors
    clearErrors();
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#F44336';
    errorMessage.style.fontSize = '0.8rem';
    errorMessage.style.marginTop = '5px';
    
    // Add error class to input
    inputElement.classList.add('input-error');
    inputElement.style.borderColor = '#F44336';
    
    // Insert error message after input
    inputElement.parentNode.appendChild(errorMessage);
    
    // Focus the input with error
    inputElement.focus();
}

// Clear error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const inputErrors = document.querySelectorAll('.input-error');
    
    errorMessages.forEach(el => el.remove());
    inputErrors.forEach(el => {
        el.classList.remove('input-error');
        el.style.borderColor = '';
    });
}

// Submit to Google Sheet
function submitToGoogleSheet() {
    const mataKuliah = document.getElementById('mata_kuliah').value;
    const kelompok = document.getElementById('kelompok').value;
    const anggota = document.getElementById('anggota').value;
    const githubLink = document.getElementById('github_link').value;
    const keterangan = document.getElementById('keterangan').value;
    
    // Data yang akan dikirim
    const data = {
        mataKuliah,
        kelompok,
        anggota,
        githubLink,
        keterangan,
        timestamp: new Date().toISOString()
    };
    
    // Kirim data ke Google Apps Script
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // Hide loader
        const loaderOverlay = document.getElementById('loaderOverlay');
        loaderOverlay.classList.remove('show');
        
        // Reset form
        document.getElementById('githubForm').reset();
        
        // Show success modal
        showModal();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        
        // Hide loader
        const loaderOverlay = document.getElementById('loaderOverlay');
        loaderOverlay.classList.remove('show');
        
        // Show error message
        alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    });
}

// Modal handling
function initModal() {
    const modal = document.getElementById('notificationModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalBtn = document.querySelector('.modal-button');
    
    if (modal && closeBtn && modalBtn) {
        // Close modal when X is clicked
        closeBtn.addEventListener('click', function() {
            hideModal();
        });
        
        // Close modal when OK button is clicked
        modalBtn.addEventListener('click', function() {
            hideModal();
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
}

// Show modal
function showModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

// Hide modal
function hideModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}