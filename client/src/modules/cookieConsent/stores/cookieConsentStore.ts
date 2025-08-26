import { create } from 'zustand';
import { CookieCategory, CookiePreferences, CookieConsentState } from '../types/cookieConsent';

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';
const COOKIE_CONSENT_EXPIRY_DAYS = 365;

interface CookieConsentStore extends CookieConsentState {
  isConfigureModalOpen: boolean;
  acceptAll: () => void;
  declineAll: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  openConfigureModal: () => void;
  closeConfigureModal: () => void;
  updateCategoryPreference: (category: CookieCategory, value: boolean) => void;
  loadConsentFromStorage: () => void;
}

const getDefaultPreferences = (): CookiePreferences => ({
  [CookieCategory.ESSENTIAL]: true,
  [CookieCategory.ANALYTICS]: false,
  [CookieCategory.MARKETING]: false,
  [CookieCategory.FUNCTIONAL]: false,
});

const saveToLocalStorage = (preferences: CookiePreferences): void => {
  const consentData = {
    preferences,
    timestamp: new Date().toISOString(),
    expiryDate: new Date(Date.now() + COOKIE_CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  };
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
};

const loadFromLocalStorage = (): { hasConsent: boolean; preferences: CookiePreferences; timestamp?: string } => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      return { hasConsent: false, preferences: getDefaultPreferences() };
    }

    const data = JSON.parse(stored);
    const expiryDate = new Date(data.expiryDate);

    if (expiryDate < new Date()) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return { hasConsent: false, preferences: getDefaultPreferences() };
    }

    return {
      hasConsent: true,
      preferences: data.preferences,
      timestamp: data.timestamp,
    };
  } catch {
    return { hasConsent: false, preferences: getDefaultPreferences() };
  }
};

export const useCookieConsentStore = create<CookieConsentStore>((set) => ({
  hasConsent: false,
  preferences: getDefaultPreferences(),
  consentTimestamp: undefined,
  isConfigureModalOpen: false,

  acceptAll: () => {
    const preferences: CookiePreferences = {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.ANALYTICS]: true,
      [CookieCategory.MARKETING]: true,
      [CookieCategory.FUNCTIONAL]: true,
    };
    saveToLocalStorage(preferences);
    set({
      hasConsent: true,
      preferences,
      consentTimestamp: new Date().toISOString(),
    });
  },

  declineAll: () => {
    const preferences: CookiePreferences = {
      [CookieCategory.ESSENTIAL]: true,
      [CookieCategory.ANALYTICS]: false,
      [CookieCategory.MARKETING]: false,
      [CookieCategory.FUNCTIONAL]: false,
    };
    saveToLocalStorage(preferences);
    set({
      hasConsent: true,
      preferences,
      consentTimestamp: new Date().toISOString(),
    });
  },

  savePreferences: (preferences: CookiePreferences) => {
    saveToLocalStorage(preferences);
    set({
      hasConsent: true,
      preferences,
      consentTimestamp: new Date().toISOString(),
      isConfigureModalOpen: false,
    });
  },

  openConfigureModal: () => set({ isConfigureModalOpen: true }),

  closeConfigureModal: () => set({ isConfigureModalOpen: false }),

  updateCategoryPreference: (category: CookieCategory, value: boolean) => {
    if (category === CookieCategory.ESSENTIAL) return;

    set((state) => ({
      preferences: {
        ...state.preferences,
        [category]: value,
      },
    }));
  },

  loadConsentFromStorage: () => {
    const { hasConsent, preferences, timestamp } = loadFromLocalStorage();
    set({ hasConsent, preferences, consentTimestamp: timestamp });
  },
}));