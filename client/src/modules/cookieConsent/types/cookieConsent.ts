export enum CookieCategory {
  ESSENTIAL = 'essential',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  FUNCTIONAL = 'functional'
}

export interface CookiePreferences {
  [CookieCategory.ESSENTIAL]: boolean;
  [CookieCategory.ANALYTICS]: boolean;
  [CookieCategory.MARKETING]: boolean;
  [CookieCategory.FUNCTIONAL]: boolean;
}

export interface CookieConsentState {
  hasConsent: boolean;
  preferences: CookiePreferences;
  consentTimestamp?: string;
}