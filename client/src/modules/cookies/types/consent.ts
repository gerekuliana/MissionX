export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface CookieConsent {
  timestamp: number;
  categories: {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  };
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential/Necessary',
    description: 'Required for the website to function properly. Cannot be disabled.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics/Performance',
    description: 'Help us understand how visitors interact with our website.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing/Advertising',
    description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
    required: false,
  },
  {
    id: 'functional',
    name: 'Functional/Preferences',
    description: 'Enable enhanced functionality and personalization.',
    required: false,
  },
];

export const CONSENT_STORAGE_KEY = 'cookie-consent';