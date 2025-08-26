import { create } from 'zustand';
import { CookieConsent } from '../types/consent';
import { consentStorage } from '../services/consentStorage';

interface ConsentStore {
  isVisible: boolean;
  isConfigureOpen: boolean;
  consent: CookieConsent | null;
  tempPreferences: CookieConsent['categories'] | null;

  showBanner: () => void;
  hideBanner: () => void;
  openConfigure: () => void;
  closeConfigure: () => void;

  acceptAll: () => void;
  declineAll: () => void;
  updateTempPreference: (category: string, value: boolean) => void;
  savePreferences: () => void;

  initialize: () => void;
}

export const useConsentStore = create<ConsentStore>((set, get) => ({
  isVisible: false,
  isConfigureOpen: false,
  consent: null,
  tempPreferences: null,

  showBanner: () => set({ isVisible: true }),
  hideBanner: () => set({ isVisible: false }),

  openConfigure: () => {
    const currentConsent = get().consent;
    const defaultPreferences = currentConsent?.categories || {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    set({
      isConfigureOpen: true,
      tempPreferences: { ...defaultPreferences },
    });
  },

  closeConfigure: () => set({
    isConfigureOpen: false,
    tempPreferences: null,
  }),

  acceptAll: () => {
    consentStorage.acceptAll();
    const consent = consentStorage.getConsent();
    set({
      consent,
      isVisible: false,
      isConfigureOpen: false,
    });
  },

  declineAll: () => {
    consentStorage.declineAll();
    const consent = consentStorage.getConsent();
    set({
      consent,
      isVisible: false,
      isConfigureOpen: false,
    });
  },

  updateTempPreference: (category: string, value: boolean) => {
    const tempPreferences = get().tempPreferences;
    if (tempPreferences && category !== 'essential') {
      set({
        tempPreferences: {
          ...tempPreferences,
          [category]: value,
        },
      });
    }
  },

  savePreferences: () => {
    const tempPreferences = get().tempPreferences;
    if (tempPreferences) {
      consentStorage.saveCustomPreferences(tempPreferences);
      const consent = consentStorage.getConsent();
      set({
        consent,
        isVisible: false,
        isConfigureOpen: false,
        tempPreferences: null,
      });
    }
  },

  initialize: () => {
    const consent = consentStorage.getConsent();
    const shouldShowBanner = !consentStorage.hasConsent();
    set({
      consent,
      isVisible: shouldShowBanner,
    });
  },
}));