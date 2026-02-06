/**
 * Cookie Consent Manager - EU GDPR Compliant
 * Manages cookie consent banner, settings modal, and cookie preferences
 */

(function() {
    'use strict';

    // Configuration
    const COOKIE_CONFIG = {
        consentCookieName: 'cookie_consent',
        cookieExpireDays: 365,
        defaultPreferences: {
            essential: true,
            personalization: false,
            analytics: false,
            advertising: false
        }
    };

    // DOM Elements
    let elements = {};

    /**
     * Initialize the cookie consent system
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeElements);
        } else {
            initializeElements();
        }
    }

    /**
     * Initialize DOM elements and event listeners
     */
    function initializeElements() {
        // Get all DOM elements
        elements = {
            // Banner elements
            banner: document.getElementById('cookieConsentBanner'),
            acceptAllBtn: document.getElementById('acceptAllCookies'),
            rejectBtn: document.getElementById('rejectNonEssential'),
            configureBtn: document.getElementById('configureCookies'),
            
            // Modal elements
            modal: document.getElementById('cookieSettingsModal'),
            modalOverlay: document.getElementById('modalOverlay'),
            closeModalBtn: document.getElementById('closeModal'),
            savePreferencesBtn: document.getElementById('savePreferences'),
            acceptAllModalBtn: document.getElementById('acceptAllModal'),
            
            // Cookie category checkboxes
            personalizationCheckbox: document.getElementById('personalizationCookies'),
            analyticsCheckbox: document.getElementById('analyticsCookies'),
            advertisingCheckbox: document.getElementById('advertisingCookies'),
            
            // Floating button
            floatingBtn: document.getElementById('cookieFloatingBtn'),
            
            // Details toggles
            detailsToggles: document.querySelectorAll('.details-toggle')
        };

        // Check if consent already exists
        const existingConsent = getCookieConsent();
        if (existingConsent) {
            // User has already made a choice
            hideBanner();
            showFloatingButton();
            applyCookiePreferences(existingConsent);
        } else {
            // Show banner for first-time visitors
            showBanner();
        }

        // Attach event listeners
        attachEventListeners();
    }

    /**
     * Attach event listeners to buttons and interactive elements
     */
    function attachEventListeners() {
        // Banner buttons
        if (elements.acceptAllBtn) {
            elements.acceptAllBtn.addEventListener('click', handleAcceptAll);
        }
        
        if (elements.rejectBtn) {
            elements.rejectBtn.addEventListener('click', handleRejectNonEssential);
        }
        
        if (elements.configureBtn) {
            elements.configureBtn.addEventListener('click', openModal);
        }

        // Modal buttons
        if (elements.closeModalBtn) {
            elements.closeModalBtn.addEventListener('click', closeModal);
        }
        
        if (elements.modalOverlay) {
            elements.modalOverlay.addEventListener('click', closeModal);
        }
        
        if (elements.savePreferencesBtn) {
            elements.savePreferencesBtn.addEventListener('click', handleSavePreferences);
        }
        
        if (elements.acceptAllModalBtn) {
            elements.acceptAllModalBtn.addEventListener('click', handleAcceptAll);
        }

        // Floating button
        if (elements.floatingBtn) {
            elements.floatingBtn.addEventListener('click', openModal);
        }

        // Details toggles
        elements.detailsToggles.forEach(toggle => {
            toggle.addEventListener('click', handleDetailsToggle);
        });

        // Keyboard accessibility - ESC to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.modal && elements.modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /**
     * Handle Accept All Cookies
     */
    function handleAcceptAll() {
        const preferences = {
            essential: true,
            personalization: true,
            analytics: true,
            advertising: true,
            timestamp: new Date().toISOString()
        };
        
        saveCookieConsent(preferences);
        applyCookiePreferences(preferences);
        hideBanner();
        closeModal();
        showFloatingButton();
        
        console.log('All cookies accepted');
    }

    /**
     * Handle Reject Non-Essential Cookies
     */
    function handleRejectNonEssential() {
        const preferences = {
            essential: true,
            personalization: false,
            analytics: false,
            advertising: false,
            timestamp: new Date().toISOString()
        };
        
        saveCookieConsent(preferences);
        applyCookiePreferences(preferences);
        hideBanner();
        closeModal();
        showFloatingButton();
        
        console.log('Non-essential cookies rejected');
    }

    /**
     * Handle Save Custom Preferences
     */
    function handleSavePreferences() {
        const preferences = {
            essential: true, // Always true
            personalization: elements.personalizationCheckbox ? elements.personalizationCheckbox.checked : false,
            analytics: elements.analyticsCheckbox ? elements.analyticsCheckbox.checked : false,
            advertising: elements.advertisingCheckbox ? elements.advertisingCheckbox.checked : false,
            timestamp: new Date().toISOString()
        };
        
        saveCookieConsent(preferences);
        applyCookiePreferences(preferences);
        hideBanner();
        closeModal();
        showFloatingButton();
        
        console.log('Custom cookie preferences saved:', preferences);
    }

    /**
     * Open cookie settings modal
     */
    function openModal() {
        if (!elements.modal) return;
        
        // Load current preferences into checkboxes
        const currentPreferences = getCookieConsent() || COOKIE_CONFIG.defaultPreferences;
        
        if (elements.personalizationCheckbox) {
            elements.personalizationCheckbox.checked = currentPreferences.personalization;
        }
        if (elements.analyticsCheckbox) {
            elements.analyticsCheckbox.checked = currentPreferences.analytics;
        }
        if (elements.advertisingCheckbox) {
            elements.advertisingCheckbox.checked = currentPreferences.advertising;
        }
        
        elements.modal.classList.add('active');
        
        // Focus management for accessibility
        if (elements.closeModalBtn) {
            elements.closeModalBtn.focus();
        }
    }

    /**
     * Close cookie settings modal
     */
    function closeModal() {
        if (!elements.modal) return;
        elements.modal.classList.remove('active');
    }

    /**
     * Handle details toggle for cookie categories
     */
    function handleDetailsToggle(event) {
        const button = event.currentTarget;
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) return;
        
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            targetElement.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
        } else {
            targetElement.removeAttribute('hidden');
            button.setAttribute('aria-expanded', 'true');
        }
    }

    /**
     * Show cookie consent banner
     */
    function showBanner() {
        if (elements.banner) {
            elements.banner.classList.remove('hidden');
        }
    }

    /**
     * Hide cookie consent banner
     */
    function hideBanner() {
        if (elements.banner) {
            elements.banner.classList.add('hidden');
        }
    }

    /**
     * Show floating cookie button
     */
    function showFloatingButton() {
        if (elements.floatingBtn) {
            elements.floatingBtn.style.display = 'flex';
        }
    }

    /**
     * Save cookie consent to localStorage
     */
    function saveCookieConsent(preferences) {
        try {
            localStorage.setItem(COOKIE_CONFIG.consentCookieName, JSON.stringify(preferences));
            
            // Also save as actual cookie for server-side reading
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (COOKIE_CONFIG.cookieExpireDays * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + expiryDate.toUTCString();
            
            document.cookie = COOKIE_CONFIG.consentCookieName + '=' + JSON.stringify(preferences) + ';' + expires + ';path=/;SameSite=Lax';
        } catch (error) {
            console.error('Error saving cookie consent:', error);
        }
    }

    /**
     * Get cookie consent from localStorage
     */
    function getCookieConsent() {
        try {
            const consent = localStorage.getItem(COOKIE_CONFIG.consentCookieName);
            return consent ? JSON.parse(consent) : null;
        } catch (error) {
            console.error('Error reading cookie consent:', error);
            return null;
        }
    }

    /**
     * Apply cookie preferences (enable/disable tracking scripts)
     */
    function applyCookiePreferences(preferences) {
        // Remove non-consented cookies
        if (!preferences.analytics) {
            removeAnalyticsCookies();
        }
        
        if (!preferences.advertising) {
            removeAdvertisingCookies();
        }
        
        if (!preferences.personalization) {
            removePersonalizationCookies();
        }

        // Initialize allowed tracking scripts
        if (preferences.analytics) {
            initializeAnalytics();
        }
        
        if (preferences.advertising) {
            initializeAdvertising();
        }
        
        if (preferences.personalization) {
            initializePersonalization();
        }

        // Dispatch custom event for other scripts to react to
        const event = new CustomEvent('cookieConsentUpdated', { 
            detail: preferences 
        });
        document.dispatchEvent(event);
    }

    /**
     * Remove analytics cookies
     */
    function removeAnalyticsCookies() {
        const analyticsCookies = ['_ga', '_gid', '_gat', '_gat_UA'];
        analyticsCookies.forEach(cookieName => {
            deleteCookie(cookieName);
            // Also delete with domain variations
            deleteCookie(cookieName, window.location.hostname);
            deleteCookie(cookieName, '.' + window.location.hostname);
        });
    }

    /**
     * Remove advertising cookies
     */
    function removeAdvertisingCookies() {
        const adCookies = ['_fbp', 'IDE', 'Conversión'];
        adCookies.forEach(cookieName => {
            deleteCookie(cookieName);
            deleteCookie(cookieName, window.location.hostname);
            deleteCookie(cookieName, '.' + window.location.hostname);
        });
    }

    /**
     * Remove personalization cookies
     */
    function removePersonalizationCookies() {
        const personalizationCookies = ['language_preference', 'pickup_location', 'accessibility_mode', 'hotel_association'];
        personalizationCookies.forEach(cookieName => {
            deleteCookie(cookieName);
        });
    }

    /**
     * Delete a specific cookie
     */
    function deleteCookie(name, domain) {
        const domainStr = domain ? ';domain=' + domain : '';
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/' + domainStr;
    }

    /**
     * Initialize Google Analytics (if consented)
     */
    function initializeAnalytics() {
        // Check if GA is already loaded
        if (window.ga || window.gtag) {
            console.log('Analytics already initialized');
            return;
        }

        // Example: Load Google Analytics
        // Uncomment and configure with your tracking ID
        /*
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-XXXXXXXXX-X');
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X';
        document.head.appendChild(script);
        */
        
        console.log('Analytics tracking initialized');
    }

    /**
     * Initialize advertising scripts (if consented)
     */
    function initializeAdvertising() {
        // Example: Load Facebook Pixel or Google Ads
        // Uncomment and configure with your IDs
        /*
        // Facebook Pixel
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
        */
        
        console.log('Advertising tracking initialized');
    }

    /**
     * Initialize personalization features (if consented)
     */
    function initializePersonalization() {
        // Example: Restore user preferences from cookies
        console.log('Personalization features initialized');
    }

    /**
     * Public API
     */
    window.CookieConsent = {
        /**
         * Get current consent status
         */
        getConsent: function() {
            return getCookieConsent();
        },
        
        /**
         * Update consent preferences
         */
        updateConsent: function(preferences) {
            saveCookieConsent(preferences);
            applyCookiePreferences(preferences);
        },
        
        /**
         * Open settings modal
         */
        openSettings: function() {
            openModal();
        },
        
        /**
         * Check if specific category is consented
         */
        hasConsent: function(category) {
            const consent = getCookieConsent();
            return consent ? consent[category] === true : false;
        }
    };

    // Initialize on load
    init();
})();
