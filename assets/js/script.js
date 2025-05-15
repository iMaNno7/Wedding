// Parse URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const details = params.get('details');
    return { name, details };
}

// Update guest info display
function updateGuestInfo() {
    const { name, details } = getUrlParams();
    const guestInfo = document.getElementById('guestInfo');
    
    if (name) {
        const nameParts = name.split('-');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts[1] || '';
        
        let displayText = name.replace('-', ' ');
        if (details) {
            displayText += ` (${details})`;
        }
        guestInfo.textContent = displayText;
    } else {
        guestInfo.textContent = 'مهمان عزیز';
    }
}

// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('2025-06-12T18:00:00+03:30').getTime();
    
    function update() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = '<p>مراسم آغاز شده است!</p>';
        }
    }

    update();
    const countdownInterval = setInterval(update, 1000);
}

// Handle form submission
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    // Add to document
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setupForm() {
    const form = document.getElementById('rsvpForm');
    const submitButton = form.querySelector('.submit-button');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');
    const buttonText = submitButton.querySelector('.button-text');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitButton.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        
        const currentDate = new Date().toISOString();
        document.getElementById('currentDate').value = currentDate;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbywMC0gObdym8Fs5Ct5WtxbGIvUFhcjgpAO7ZFMqBOvUDTqrNbbL994J9oMVOMhSROgDw/exec', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                showToast('پاسخ شما با موفقیت ثبت شد.', 'success');
                form.reset();
            } else {
                showToast('خطا در ثبت پاسخ. لطفا دوباره تلاش کنید.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('خطا در ارسال فرم. لطفا دوباره تلاش کنید.', 'error');
        } finally {
            // Hide loading state
            submitButton.disabled = false;
            loadingSpinner.style.display = 'none';
        }
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateGuestInfo();
    updateCountdown();
    setupForm();
});
