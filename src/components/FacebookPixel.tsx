import React, { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
  }
}

const FacebookPixel: React.FC = () => {
  useEffect(() => {
    const pixelId = import.meta.env.VITE_FB_PIXEL_ID;
    
    if (!pixelId) {
      console.warn('Facebook Pixel ID is not set');
      return;
    }

    // Initialize Facebook Pixel
    window.fbq = function() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
    };
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    window.fbq('init', pixelId);

    // Track PageView
    window.fbq('track', 'PageView');

    return () => {
      window.fbq('track', 'PageView');
    };
  }, []);

  return null;
};

export default FacebookPixel; 