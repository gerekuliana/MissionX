import { create } from 'zustand';
import { CookieConsent, CookiePreferences } from '../types/cookies';

const COOKIE_CONSENT_KEY = 'cookie_consent';

interface CookieConsentState {
  showBanner: boolean;
  showConfigModal: boolean;
  preferences: CookiePreferences;
  tempConsent: CookieConsent;
  loadConsent: () => void;
  acceptAll: () => void;
  declineAll: () => void;
  savePreferences: (consent: CookieConsent) => void;
  openConfigModal: () => void;
  closeConfigModal: () => void;
  updateTempConsent: (category: keyof CookieConsent, value: boolean) => void;
}

const getDefaultConsent = (): CookieConsent => ({
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
  timestamp: Date.now(),
});

const loadConsentFromStorage = (): CookiePreferences => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        consentGiven: true,
        consent: parsed,
      };
    }
  } catch (error) {
    console.error('Error loading cookie consent:', error);
  }
  return {
    consentGiven: false,
    consent: null,
  };
};

const saveConsentToStorage = (consent: CookieConsent): void => {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
};

export const useCookieConsentStore = create<CookieConsentState>((set, get) => ({
  showBanner: false,
  showConfigModal: false,
  preferences: {
    consentGiven: false,
    consent: null,
  },
  tempConsent: getDefaultConsent(),

  loadConsent: () => {
    const preferences = loadConsentFromStorage();
    set({
      preferences,
      showBanner: !preferences.consentGiven,
      tempConsent: preferences.consent || getDefaultConsent(),
    });
  },

  acceptAll: () => {
    const consent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now(),
    };
    saveConsentToStorage(consent);
    set({
      preferences: {
        consentGiven: true,
        consent,
      },
      showBanner: false,
      showConfigModal: false,
    });
  },

  declineAll: () => {
    const consent: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now(),
    };
    saveConsentToStorage(consent);
    set({
      preferences: {
        consentGiven: true,
        consent,
      },
      showBanner: false,
      showConfigModal: false,
    });
  },

  savePreferences: (consent: CookieConsent) => {
    const updatedConsent = {
      ...consent,
      essential: true,
      timestamp: Date.now(),
    };
    saveConsentToStorage(updatedConsent);
    set({
      preferences: {
        consentGiven: true,
        consent: updatedConsent,
      },
      showBanner: false,
      showConfigModal: false,
    });
  },

  openConfigModal: () => {
    const { preferences } = get();
    set({
      showConfigModal: true,
      tempConsent: preferences.consent || getDefaultConsent(),
    });
  },

  closeConfigModal: () => {
    set({
      showConfigModal: false,
    });
  },

  updateTempConsent: (category: keyof CookieConsent, value: boolean) => {
    if (category === 'timestamp' || category === 'essential') return;
    set((state) => ({
      tempConsent: {
        ...state.tempConsent,
        [category]: value,
      },
    }));
  },
}));