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

    translateByDataKey(key, text) {
        const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
        elements.forEach(el => {
            el.textContent = text;
        });
    }

    translatePageContent(lang, trans) {
        // Home page translations
        this.translateByDataKey('home_welcome', trans.home_welcome);
        this.translateByDataKey('home_subtitle', trans.home_subtitle);
        this.translateByDataKey('home_about_title', trans.home_about_title);
        this.translateByDataKey('home_mission_title', trans.home_mission_title);
        this.translateByDataKey('home_mission_text', trans.home_mission_text);
        this.translateByDataKey('home_vision_title', trans.home_vision_title);
        this.translateByDataKey('home_vision_text', trans.home_vision_text);
        this.translateByDataKey('home_values_title', trans.home_values_title);
        this.translateByDataKey('home_values_safety', trans.home_values_safety);
        this.translateByDataKey('home_values_punctuality', trans.home_values_punctuality);
        this.translateByDataKey('home_values_respect', trans.home_values_respect);
        this.translateByDataKey('home_values_environment', trans.home_values_environment);
        this.translateByDataKey('home_services_title', trans.home_services_title);
        this.translateByDataKey('home_service_routes_title', trans.home_service_routes_title);
        this.translateByDataKey('home_service_routes_text', trans.home_service_routes_text);
        this.translateByDataKey('home_service_schedule_title', trans.home_service_schedule_title);
        this.translateByDataKey('home_service_schedule_text', trans.home_service_schedule_text);
        this.translateByDataKey('home_service_rates_title', trans.home_service_rates_title);
        this.translateByDataKey('home_service_rates_text', trans.home_service_rates_text);
        this.translateByDataKey('home_service_accessibility_title', trans.home_service_accessibility_title);
        this.translateByDataKey('home_service_accessibility_text', trans.home_service_accessibility_text);
        this.translateByDataKey('home_why_choose_title', trans.home_why_choose_title);
        this.translateByDataKey('home_why_experience_title', trans.home_why_experience_title);
        this.translateByDataKey('home_why_experience_text', trans.home_why_experience_text);
        this.translateByDataKey('home_why_fleet_title', trans.home_why_fleet_title);
        this.translateByDataKey('home_why_fleet_text', trans.home_why_fleet_text);
        this.translateByDataKey('home_why_staff_title', trans.home_why_staff_title);
        this.translateByDataKey('home_why_staff_text', trans.home_why_staff_text);

        // Contact page translations
        this.translateByDataKey('contact_title', trans.contact_title);
        this.translateByDataKey('contact_subtitle', trans.contact_subtitle);
        this.translateByDataKey('contact_info_title', trans.contact_info_title);
        this.translateByDataKey('contact_address_title', trans.contact_address_title);
        this.translateByDataKey('contact_phone_title', trans.contact_phone_title);
        this.translateByDataKey('contact_email_title', trans.contact_email_title);
        this.translateByDataKey('contact_hours_title', trans.contact_hours_title);
        this.translateByDataKey('contact_hours_weekdays', trans.contact_hours_weekdays);
        this.translateByDataKey('contact_hours_saturday', trans.contact_hours_saturday);
        this.translateByDataKey('contact_hours_sunday', trans.contact_hours_sunday);
        this.translateByDataKey('contact_form_title', trans.contact_form_title);
        this.translateByDataKey('contact_form_name', trans.contact_form_name);
        this.translateByDataKey('contact_form_email', trans.contact_form_email);
        this.translateByDataKey('contact_form_phone', trans.contact_form_phone);
        this.translateByDataKey('contact_form_subject', trans.contact_form_subject);
        this.translateByDataKey('contact_form_message', trans.contact_form_message);
        this.translateByDataKey('contact_form_submit', trans.contact_form_submit);
        this.translateByDataKey('contact_success_title', trans.contact_success_title);
        this.translateByDataKey('contact_success_text', trans.contact_success_text);

        // Questionnaire page translations
        this.translateByDataKey('questionnaire_title', trans.questionnaire_title);
        this.translateByDataKey('questionnaire_subtitle', trans.questionnaire_subtitle);
        this.translateByDataKey('questionnaire_intro', trans.questionnaire_intro);

        // Service map page translations
        this.translateByDataKey('service_map_title', trans.service_map_title);
        this.translateByDataKey('service_map_subtitle', trans.service_map_subtitle);

        // Island map page translations
        this.translateByDataKey('island_map_title', trans.island_map_title);
        this.translateByDataKey('island_map_subtitle', trans.island_map_subtitle);

        // Service charter page translations
        this.translateByDataKey('service_charter_title', trans.service_charter_title);
        this.translateByDataKey('service_charter_subtitle', trans.service_charter_subtitle);
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
