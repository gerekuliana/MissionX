export type CookieConsent = 'accepted' | 'declined' | null;

export interface CookiePreferences {
  consent: CookieConsent;
  timestamp: string;
  functional: boolean;
  analytics: boolean;
  thirdParty: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie_consent_preferences';

export const cookieManager = {
  getPreferences(): CookiePreferences | null {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  savePreferences(consent: CookieConsent): void {
    const preferences: CookiePreferences = {
      consent,
      timestamp: new Date().toISOString(),
      functional: consent === 'accepted',
      analytics: consent === 'accepted',
      thirdParty: consent === 'accepted',
    };

    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));

    if (consent === 'declined') {
      this.blockNonEssentialCookies();
    }
  },

  blockNonEssentialCookies(): void {
    const essentialCookies = ['__client', '__session', '__clerk'];

    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      const cookieName = name.trim();

      const isEssential = essentialCookies.some(essential =>
        cookieName.startsWith(essential),
      );

      if (!isEssential && cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });

    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied',
      });
    }

    this.blockThirdPartyScripts();
  },

  allowAllCookies(): void {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'functionality_storage': 'granted',
        'personalization_storage': 'granted',
      });
    }
  },

  blockThirdPartyScripts(): void {
    const blockedDomains = [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.com',
      'doubleclick.net',
      'twitter.com',
      'linkedin.com',
    ];

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT' || node.nodeName === 'IFRAME') {
            const element = node as HTMLScriptElement | HTMLIFrameElement;
            const src = element.src;

            if (src && blockedDomains.some(domain => src.includes(domain))) {
              element.remove();
            }
          }
        });
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  },

  hasUserConsented(): boolean {
    const preferences = this.getPreferences();
    return preferences?.consent !== null;
  },
};

declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters: Record<string, string>) => void;
  }
}