import { useEffect } from 'react';
import { useCookieConsentStore } from '../stores/cookieConsentStore';

// Type for Google Analytics gtag function
type GtagFunction = (
  command: string,
  action: string,
  params: Record<string, string>
) => void;

declare global {
  interface Window {
    gtag?: GtagFunction;
  }
}

export const useCookieConsent = () => {
  const store = useCookieConsentStore();

  useEffect(() => {
    const handleConsentUpdate = (event: CustomEvent) => {
      const { acceptedCategories } = event.detail;

      // Handle analytics cookies
      if (acceptedCategories.includes('analytics')) {
        // Enable Google Analytics or other analytics services
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
          });
        }
      } else {
        // Disable analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
          });
        }
      }

      // Handle marketing cookies
      if (acceptedCategories.includes('marketing')) {
        // Enable marketing/advertising services
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
          });
        }
      } else {
        // Disable marketing
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
          });
        }
      }
    };

    window.addEventListener('cookieConsentUpdate', handleConsentUpdate as EventListener);

    // Set initial consent state
    if (store.consentGiven) {
      handleConsentUpdate(new CustomEvent('cookieConsentUpdate', {
        detail: { acceptedCategories: store.acceptedCategories },
      }));
    }

    return () => {
      window.removeEventListener('cookieConsentUpdate', handleConsentUpdate as EventListener);
    };
  }, [store.consentGiven, store.acceptedCategories]);

  return store;
};

// Utility function to check if a specific cookie category is consented
export const canUseCookies = (category: 'essential' | 'analytics' | 'marketing'): boolean => {
  const { hasConsent } = useCookieConsentStore.getState();
  return hasConsent(category);
};

// Utility function to get GDPR-compliant cookie options
export const getCookieOptions = (category: 'essential' | 'analytics' | 'marketing') => {
  if (!canUseCookies(category)) {
    return null;
  }

  // Return cookie options based on category
  const baseOptions = {
    path: '/',
    sameSite: 'lax' as const,
    secure: window.location.protocol === 'https:',
  };

  switch (category) {
    case 'essential':
      return {
        ...baseOptions,
        expires: 365, // 1 year for essential cookies
      };
    case 'analytics':
      return {
        ...baseOptions,
        expires: 30, // 30 days for analytics
      };
    case 'marketing':
      return {
        ...baseOptions,
        expires: 90, // 90 days for marketing
      };
    default:
      return baseOptions;
  }
};