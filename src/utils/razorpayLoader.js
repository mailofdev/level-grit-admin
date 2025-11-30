/**
 * Razorpay Script Loader
 * 
 * Dynamically loads Razorpay checkout script when needed.
 * Ensures script is only loaded once and returns a promise.
 */

let razorpayLoaded = false;
let loadingPromise = null;

/**
 * Load Razorpay checkout script
 * @returns {Promise<boolean>} Promise that resolves when script is loaded
 */
export const loadRazorpayScript = () => {
  // If already loaded, return resolved promise
  if (razorpayLoaded && window.Razorpay) {
    return Promise.resolve(true);
  }

  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Create new loading promise
  loadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    
    if (existingScript) {
      // Script tag exists, wait for it to load
      existingScript.addEventListener('load', () => {
        razorpayLoaded = true;
        loadingPromise = null;
        resolve(true);
      });
      
      existingScript.addEventListener('error', () => {
        loadingPromise = null;
        reject(new Error('Failed to load Razorpay script'));
      });
      
      // If already loaded
      if (window.Razorpay) {
        razorpayLoaded = true;
        loadingPromise = null;
        resolve(true);
      }
      
      return;
    }

    // Create and append script tag
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      razorpayLoaded = true;
      loadingPromise = null;
      resolve(true);
    };

    script.onerror = () => {
      loadingPromise = null;
      reject(new Error('Failed to load Razorpay script. Please check your internet connection.'));
    };

    document.body.appendChild(script);
  });

  return loadingPromise;
};

/**
 * Check if Razorpay is available
 * @returns {boolean} True if Razorpay is loaded and available
 */
export const isRazorpayAvailable = () => {
  return razorpayLoaded && typeof window.Razorpay !== 'undefined';
};

