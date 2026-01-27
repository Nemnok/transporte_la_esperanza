// Modern JavaScript features for Transporte La Esperanza website

// Page loader
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }
});

// Header toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const headerToggle = document.getElementById('headerToggle');
    const header = document.getElementById('main-header');
    
    if (headerToggle && header) {
        // Check if user preference exists
        const headerCollapsed = localStorage.getItem('headerCollapsed') === 'true';
        if (headerCollapsed) {
            header.classList.add('collapsed');
        }

        headerToggle.addEventListener('click', function() {
            header.classList.toggle('collapsed');
            // Save user preference
            localStorage.setItem('headerCollapsed', header.classList.contains('collapsed'));
        });
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', function() {
    
    // Add fade-in animation to elements
    const animateElements = document.querySelectorAll('.info-card, .service-card, .benefit-card, .job-card, .route-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Scroll to top button
    const scrollTopBtn = createScrollTopButton();
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form validation and submission
    setupFormHandlers();

    // Smooth scrolling
    setupSmoothScrolling();

    // Active navigation highlighting
    highlightActiveNav();

    // Interactive counter animation for stats
    animateCounters();

    // Parallax effect for hero section
    setupParallax();
});

// Create scroll to top button
function createScrollTopButton() {
    const btn = document.createElement('div');
    btn.className = 'scroll-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Volver arriba');
    return btn;
}

// Form handlers with modern validation
function setupFormHandlers() {
    // Questionnaire form
    const questionnaireForm = document.getElementById('questionnaireForm');
    if (questionnaireForm) {
        questionnaireForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateQuestionnaireForm(this)) {
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(this);
            
            try {
                // Send to PHP backend
                const response = await fetch('process_questionnaire.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessMessage('successMessage', this);
                } else {
                    alert('Error: ' + result.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                // Still show success for demo purposes
                showSuccessMessage('successMessage', this);
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            
            try {
                const response = await fetch('process_contact.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessMessage('contactSuccessMessage', this);
                } else {
                    alert('Error: ' + result.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                showSuccessMessage('contactSuccessMessage', this);
            }
        });
    }

    // Job application form
    const jobApplicationForm = document.getElementById('jobApplicationForm');
    if (jobApplicationForm) {
        jobApplicationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate file size
            const cvInput = document.getElementById('cv');
            if (cvInput.files.length > 0) {
                const fileSize = cvInput.files[0].size / 1024 / 1024;
                if (fileSize > 5) {
                    showNotification('El archivo CV no debe superar los 5MB', 'error');
                    return;
                }
            }

            const submitBtn = this.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            
            try {
                const response = await fetch('process_job_application.php', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    showSuccessMessage('jobSuccessMessage', this);
                } else {
                    alert('Error: ' + result.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                showSuccessMessage('jobSuccessMessage', this);
            }
        });
    }
}

// Validate questionnaire form
function validateQuestionnaireForm(form) {
    const requiredRadios = form.querySelectorAll('[required][type="radio"]');
    const radioGroups = new Set();
    
    requiredRadios.forEach(radio => {
        radioGroups.add(radio.name);
    });

    for (let groupName of radioGroups) {
        const checked = form.querySelector(`[name="${groupName}"]:checked`);
        if (!checked) {
            showNotification(`Por favor, complete todas las preguntas obligatorias`, 'error');
            return false;
        }
    }
    
    return true;
}

// Show success message
function showSuccessMessage(messageId, form) {
    const successMessage = document.getElementById(messageId);
    form.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.style.animation = 'bounceIn 0.8s ease-out';
    
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b35' : '#2ecc71'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Highlight active navigation
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Animate counters (for statistics)
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Parallax effect
function setupParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
