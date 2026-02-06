# Cookie Consent Integration Guide

## Resumen
Sistema completo de consentimiento de cookies compatible con GDPR de la UE para Transporte La Esperanza.

## Archivos Creados

### Estilos CSS
- `css/cookie-consent.css` - Estilos completos para el banner, modal y botón flotante

### JavaScript
- `js/cookie-consent.js` - Funcionalidad completa de gestión de cookies

### Políticas
- `politicas/politica-de-cookies.html` - Política de cookies detallada
- `politicas/politica-de-privacidad.html` - Política de privacidad conforme a GDPR

### Pruebas
- `test-cookie-consent.html` - Página de prueba con todas las funcionalidades

## Integración en Páginas Existentes

Para integrar el sistema de cookies en cualquier página HTML, siga estos pasos:

### 1. Agregar CSS en el `<head>`
```html
<link rel="stylesheet" href="css/cookie-consent.css">
```

### 2. Agregar el HTML del Banner antes de cerrar `</body>`

```html
<!-- Cookie Consent Banner - EU GDPR Compliant -->
<div id="cookieConsentBanner" class="cookie-consent-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies" aria-describedby="cookieConsentDescription">
    <div class="cookie-consent-container">
        <div class="cookie-consent-content">
            <div class="cookie-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.95 10.99c-1.79-.03-3.7-1.95-2.68-4.22-2.97 1-5.78-1.59-5.19-4.56C7.11.66 2 5.37 2 11.9 2 18.11 7.34 23 13.99 23c6.95 0 10.5-4.87 7.96-12.01zM8.5 15c-.83 0-1.5-.67-1.5-1.5S7.67 12 8.5 12s1.5.67 1.5 1.5S9.33 15 8.5 15zm2-5C9.67 10 9 9.33 9 8.5S9.67 7 10.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="currentColor"/>
                </svg>
            </div>
            
            <div class="cookie-text">
                <h2 class="cookie-title">🍪 Configuración de Cookies</h2>
                <p id="cookieConsentDescription" class="cookie-description">
                    Utilizamos cookies propias y de terceros para mejorar nuestros servicios, analizar el tráfico web y mostrarle publicidad relacionada con sus preferencias. 
                    Puede aceptar todas las cookies, rechazar las no esenciales o configurarlas según sus preferencias.
                </p>
                <p class="cookie-links">
                    <a href="politicas/politica-de-cookies.html" target="_blank">Política de Cookies</a> | 
                    <a href="politicas/politica-de-privacidad.html" target="_blank">Política de Privacidad</a>
                </p>
            </div>
        </div>

        <div class="cookie-buttons">
            <button id="acceptAllCookies" class="btn btn-accept" aria-label="Aceptar todas las cookies">
                ✓ Aceptar Todas
            </button>
            <button id="rejectNonEssential" class="btn btn-reject" aria-label="Rechazar cookies no esenciales">
                ✗ Rechazar No Esenciales
            </button>
            <button id="configureCookies" class="btn btn-configure" aria-label="Configurar cookies personalizadas">
                ⚙ Configurar
            </button>
        </div>
    </div>
</div>

<!-- Cookie Settings Modal -->
<div id="cookieSettingsModal" class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookieSettingsTitle">
    <div class="cookie-modal-overlay" id="modalOverlay"></div>
    <div class="cookie-modal-content">
        <div class="cookie-modal-header">
            <h2 id="cookieSettingsTitle">⚙️ Configuración de Cookies</h2>
            <button id="closeModal" class="close-modal" aria-label="Cerrar configuración">✕</button>
        </div>

        <div class="cookie-modal-body">
            <p class="modal-intro">
                Gestione sus preferencias de cookies. Las cookies técnicas son necesarias para el funcionamiento básico del sitio y no pueden desactivarse.
            </p>

            <!-- Cookies Técnicas (siempre activas) -->
            <div class="cookie-category">
                <div class="category-header">
                    <div class="category-title">
                        <h3>🔧 Cookies Técnicas</h3>
                        <span class="badge badge-required">Siempre activas</span>
                    </div>
                    <label class="switch disabled">
                        <input type="checkbox" checked disabled>
                        <span class="slider"></span>
                    </label>
                </div>
                <p class="category-description">
                    Necesarias para el funcionamiento básico del sitio web: inicio de sesión, reservas, seguridad y navegación.
                </p>
                <button class="details-toggle" data-target="technical-details" aria-expanded="false">
                    Ver detalles <span class="arrow">▼</span>
                </button>
                <div id="technical-details" class="cookie-details" hidden>
                    <ul>
                        <li><strong>session_id</strong> - Sesión activa</li>
                        <li><strong>csrf_token</strong> - Protección de seguridad</li>
                        <li><strong>user_preferences</strong> - Preferencias básicas (6 meses)</li>
                        <li><strong>booking_cart</strong> - Carrito de reserva</li>
                    </ul>
                </div>
            </div>

            <!-- Cookies de Personalización -->
            <div class="cookie-category">
                <div class="category-header">
                    <div class="category-title">
                        <h3>🎨 Cookies de Personalización</h3>
                        <span class="badge badge-optional">Opcional</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="personalizationCookies" name="personalization">
                        <span class="slider"></span>
                    </label>
                </div>
                <p class="category-description">
                    Recuerdan sus preferencias: idioma, punto de recogida, configuración de accesibilidad.
                </p>
                <button class="details-toggle" data-target="personalization-details" aria-expanded="false">
                    Ver detalles <span class="arrow">▼</span>
                </button>
                <div id="personalization-details" class="cookie-details" hidden>
                    <ul>
                        <li><strong>language_preference</strong> - Idioma seleccionado (12 meses)</li>
                        <li><strong>pickup_location</strong> - Punto de recogida preferido (6 meses)</li>
                        <li><strong>accessibility_mode</strong> - Configuración de accesibilidad (12 meses)</li>
                        <li><strong>hotel_association</strong> - Hotel asociado (6 meses)</li>
                    </ul>
                </div>
            </div>

            <!-- Cookies Analíticas -->
            <div class="cookie-category">
                <div class="category-header">
                    <div class="category-title">
                        <h3>📊 Cookies Analíticas</h3>
                        <span class="badge badge-optional">Opcional</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="analyticsCookies" name="analytics">
                        <span class="slider"></span>
                    </label>
                </div>
                <p class="category-description">
                    Nos ayudan a entender cómo los usuarios utilizan el sitio web mediante análisis anónimos (Google Analytics).
                </p>
                <button class="details-toggle" data-target="analytics-details" aria-expanded="false">
                    Ver detalles <span class="arrow">▼</span>
                </button>
                <div id="analytics-details" class="cookie-details" hidden>
                    <ul>
                        <li><strong>_ga</strong> - Google Analytics (2 años)</li>
                        <li><strong>_ga_*</strong> - Google Analytics ID (1 año 1 mes)</li>
                        <li><strong>_gid</strong> - Google Analytics sesión (1 día)</li>
                        <li><strong>_gat_UA-*</strong> - Control de solicitudes (1 minuto)</li>
                    </ul>
                </div>
            </div>

            <!-- Cookies Publicitarias -->
            <div class="cookie-category">
                <div class="category-header">
                    <div class="category-title">
                        <h3>📢 Cookies Publicitarias</h3>
                        <span class="badge badge-optional">Opcional</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="advertisingCookies" name="advertising">
                        <span class="slider"></span>
                    </label>
                </div>
                <p class="category-description">
                    Permiten mostrarle publicidad relevante basada en sus intereses (Google Ads, Facebook).
                </p>
                <button class="details-toggle" data-target="advertising-details" aria-expanded="false">
                    Ver detalles <span class="arrow">▼</span>
                </button>
                <div id="advertising-details" class="cookie-details" hidden>
                    <ul>
                        <li><strong>_fbp</strong> - Facebook Pixel (3 meses)</li>
                        <li><strong>Conversión</strong> - Google Ads (persistente)</li>
                        <li><strong>IDE</strong> - Google DoubleClick (1 año)</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="cookie-modal-footer">
            <button id="savePreferences" class="btn btn-save">Guardar Preferencias</button>
            <button id="acceptAllModal" class="btn btn-accept">Aceptar Todas</button>
        </div>
    </div>
</div>

<!-- Cookie Floating Button -->
<button id="cookieFloatingBtn" class="cookie-floating-btn" aria-label="Configuración de cookies" style="display: none;">
    🍪
</button>
```

### 3. Agregar el JavaScript antes de cerrar `</body>`
```html
<script src="js/cookie-consent.js"></script>
```

## API JavaScript

El sistema expone una API global `window.CookieConsent` con los siguientes métodos:

### Obtener el estado del consentimiento
```javascript
const consent = window.CookieConsent.getConsent();
// Retorna: { essential: true, personalization: false, analytics: false, advertising: false, timestamp: "..." }
```

### Actualizar preferencias programáticamente
```javascript
window.CookieConsent.updateConsent({
    essential: true,
    personalization: true,
    analytics: false,
    advertising: false
});
```

### Abrir el modal de configuración
```javascript
window.CookieConsent.openSettings();
```

### Verificar consentimiento de una categoría
```javascript
if (window.CookieConsent.hasConsent('analytics')) {
    // Inicializar Google Analytics
}
```

## Eventos Personalizados

El sistema emite un evento cuando se actualizan las preferencias:

```javascript
document.addEventListener('cookieConsentUpdated', function(e) {
    console.log('Preferencias actualizadas:', e.detail);
    // e.detail contiene: { essential: true, personalization: true, ... }
});
```

## Características

- ✅ **Cumplimiento GDPR**: Conforme con las regulaciones de la UE
- ✅ **Accesibilidad**: Roles ARIA, navegación por teclado
- ✅ **Responsive**: Adaptado para móvil, tablet y escritorio
- ✅ **LocalStorage**: Persistencia de preferencias
- ✅ **Cookies HTTP**: También guarda en cookies para acceso servidor
- ✅ **4 Categorías**: Técnicas, Personalización, Analíticas, Publicitarias
- ✅ **Gestión de Cookies**: Elimina cookies según preferencias
- ✅ **Botón Flotante**: Acceso rápido a configuración después de consentir
- ✅ **Políticas Detalladas**: Páginas de política de cookies y privacidad

## Personalización

### Modificar colores y estilos
Editar `css/cookie-consent.css` para cambiar:
- Colores del tema
- Tamaños de fuente
- Animaciones
- Espaciado

### Añadir/modificar categorías de cookies
Editar `js/cookie-consent.js` para:
- Agregar nuevas categorías
- Cambiar configuración de cookies
- Integrar servicios de terceros

### Configurar servicios de análisis
En `js/cookie-consent.js`, buscar las funciones:
- `initializeAnalytics()` - Para Google Analytics
- `initializeAdvertising()` - Para Google Ads, Facebook Pixel
- `initializePersonalization()` - Para características personalizadas

Descomentar y configurar con tus IDs de seguimiento.

## Pruebas

Abrir `test-cookie-consent.html` en un navegador para:
- Probar el banner de cookies
- Verificar el modal de configuración
- Comprobar que las preferencias se guardan
- Ver el botón flotante en acción

## Soporte

Para preguntas o problemas:
- Email: info@transportelaesperanza.com
- Documentación: Ver archivos de políticas en `/politicas/`
