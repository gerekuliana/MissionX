import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

interface CookieConsentState {
  consentGiven: boolean;
  consentTimestamp: string | null;
  acceptedCategories: CookieCategory[];
  showBanner: boolean;
  acceptAll: () => void;
  declineAll: () => void;
  dismissBanner: () => void;
  resetConsent: () => void;
  hasConsent: (category: CookieCategory) => boolean;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      consentGiven: false,
      consentTimestamp: null,
      acceptedCategories: ['essential'],
      showBanner: true,

      acceptAll: () => {
        set({
          consentGiven: true,
          consentTimestamp: new Date().toISOString(),
          acceptedCategories: ['essential', 'analytics', 'marketing'],
          showBanner: false,
        });

        // Enable analytics and marketing scripts
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
            detail: { acceptedCategories: ['essential', 'analytics', 'marketing'] },
          }));
        }
      },

      declineAll: () => {
        set({
          consentGiven: true,
          consentTimestamp: new Date().toISOString(),
          acceptedCategories: ['essential'],
          showBanner: false,
        });

        // Disable analytics and marketing scripts
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
            detail: { acceptedCategories: ['essential'] },
          }));
        }
      },

      dismissBanner: () => {
        set({ showBanner: false });
      },

      resetConsent: () => {
        set({
          consentGiven: false,
          consentTimestamp: null,
          acceptedCategories: ['essential'],
          showBanner: true,
        });
      },

      hasConsent: (category: CookieCategory) => {
        return get().acceptedCategories.includes(category);
      },
    }),
    {
      name: 'cookie-consent',
      partialize: (state) => ({
        consentGiven: state.consentGiven,
        consentTimestamp: state.consentTimestamp,
        acceptedCategories: state.acceptedCategories,
      }),
    },
  ),
);