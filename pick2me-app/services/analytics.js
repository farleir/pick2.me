/**
 * Envia um evento personalizado para o Google Analytics 4.
 * @param {string} eventName - O nome do evento a registar.
 * @param {object} eventParams - Parâmetros adicionais sobre o evento.
 */
export const trackEvent = (eventName, eventParams) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('Google Analytics gtag function not found.');
  }
};

