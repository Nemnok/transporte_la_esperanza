// Language switching functionality
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getSavedLanguage() || 'es';
        this.init();
    }

    init() {
        this.createLanguageSwitcher();
        this.applyTranslations(this.currentLanguage);
        this.toggleWorkTab(this.currentLanguage);
        this.setupEventListeners();
    }

    getSavedLanguage() {
        return localStorage.getItem('selectedLanguage');
    }

    saveLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
    }

    createLanguageSwitcher() {
        const headerContent = document.querySelector('.header-content .container');
        if (!headerContent) return;

        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <label for="language-select" class="language-label">🌐</label>
            <select id="language-select" class="language-select" aria-label="Select Language">
                <option value="es" ${this.currentLanguage === 'es' ? 'selected' : ''}>Español</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="de" ${this.currentLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
                <option value="fr" ${this.currentLanguage === 'fr' ? 'selected' : ''}>Français</option>
                <option value="ru" ${this.currentLanguage === 'ru' ? 'selected' : ''}>Русский</option>
            </select>
        `;

        // Insert before the h1 tag
        const h1 = headerContent.querySelector('h1');
        if (h1) {
            headerContent.insertBefore(languageSwitcher, h1);
        } else {
            headerContent.insertBefore(languageSwitcher, headerContent.firstChild);
        }
    }

    setupEventListeners() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                this.switchLanguage(newLang);
            });
        }
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        this.saveLanguage(lang);
        this.applyTranslations(lang);
        this.toggleWorkTab(lang);
    }

    applyTranslations(lang) {
        if (!translations || !translations[lang]) {
            console.error('Translations not loaded or language not found');
            return;
        }

        const trans = translations[lang];

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Translate navigation
        this.translateElement('[href="index.html"]', trans.nav_home);
        this.translateElement('[href="cuestionario.html"]', trans.nav_questionnaire);
        this.translateElement('[href="contacto.html"]', trans.nav_contact);
        this.translateElement('[href="trabajar.html"]', trans.nav_work);
        this.translateElement('[href="mapa-servicio.html"]', trans.nav_service_map);
        this.translateElement('[href="mapa-isla.html"]', trans.nav_island_map);
        this.translateElement('[href="carta-servicios.html"]', trans.nav_service_charter);

        // Translate header toggle
        const headerToggle = document.getElementById('headerToggle');
        if (headerToggle) {
            headerToggle.setAttribute('aria-label', trans.header_toggle_label);
        }

        // Translate footer
        this.translateByDataKey('footer_rights', trans.footer_rights);
        this.translateByDataKey('footer_slogan', trans.footer_slogan);

        // Translate scroll to top
        const scrollTop = document.querySelector('.scroll-top');
        if (scrollTop) {
            scrollTop.setAttribute('aria-label', trans.scroll_top_label);
        }

        // Translate page-specific content
        this.translatePageContent(lang, trans);
    }

    translateElement(selector, text) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Only translate if not inside language switcher
            if (!el.closest('.language-switcher')) {
                el.textContent = text;
            }
        });
    }

    // Helper method to update text while preserving logo
    updateTextWithLogo(element, text) {
        const logo = element.querySelector('.header-logo');
        if (logo) {
            // Clear and rebuild with logo + text
            element.innerHTML = '';
            element.appendChild(logo);
            element.appendChild(document.createTextNode(text));
        } else {
            element.textContent = text;
        }
    }

    translateByDataKey(key, text) {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        elements.forEach(el => {
            // Special handling for site_title to preserve logo
            if (key === 'site_title') {
                this.updateTextWithLogo(el, text);
            } else {
                el.textContent = text;
            }
        });
    }

    translatePageContent(lang, trans) {
        // Universal translation: translate all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                // Special handling for site_title to preserve logo
                if (key === 'site_title') {
                    this.updateTextWithLogo(el, trans[key]);
                } else {
                    el.textContent = trans[key];
                }
            }
        });
    }

    toggleWorkTab(lang) {
        // Hide "Trabaja con Nosotros" tab on non-Spanish versions
        const workTab = document.querySelector('[href="trabajar.html"]');
        if (workTab) {
            const parentLi = workTab.closest('li');
            if (parentLi) {
                if (lang === 'es') {
                    parentLi.style.display = '';
                } else {
                    parentLi.style.display = 'none';
                }
            }
        }
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if translations are loaded
    if (typeof translations !== 'undefined') {
        window.languageSwitcher = new LanguageSwitcher();
    } else {
        console.error('Translations not loaded. Please ensure translations.js is loaded before language-switcher.js');
    }
});
