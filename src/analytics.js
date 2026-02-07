// Google Analytics 4 Event Helper

export const logEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    // Development/Fallback logging
    // console.log(`[Analytics] ${eventName}`, params);
  }
};

export const logPageView = (title, path) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-M6RXRV36V1', {
      page_title: title,
      page_path: path
    });
  }
};
