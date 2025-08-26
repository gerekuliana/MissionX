import { CookieConsent, CONSENT_STORAGE_KEY } from '../types/consent';

export const consentStorage = {
  getConsent(): CookieConsent | null {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as CookieConsent;
    } catch (error) {
      console.error('Failed to retrieve cookie consent:', error);
      return null;
    }
  },

  setConsent(consent: CookieConsent): void {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  },

  hasConsent(): boolean {
    return this.getConsent() !== null;
  },

  acceptAll(): void {
    const consent: CookieConsent = {
      timestamp: Date.now(),
      categories: {
        essential: true,
        analytics: true,
        marketing: true,
        functional: true,
      },
    };
    this.setConsent(consent);
  },

  declineAll(): void {
    const consent: CookieConsent = {
      timestamp: Date.now(),
      categories: {
        essential: true,
        analytics: false,
        marketing: false,
        functional: false,
      },
    };
    this.setConsent(consent);
  },

  saveCustomPreferences(categories: CookieConsent['categories']): void {
    const consent: CookieConsent = {
      timestamp: Date.now(),
      categories: {
        ...categories,
        essential: true,
      },
    };
    this.setConsent(consent);
  },
};