import { canUseCookies } from '../hooks/useCookieConsent';

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieManager {
  // Set a cookie with consent check
  static set(
    name: string,
    value: string,
    category: 'essential' | 'analytics' | 'marketing',
    options?: CookieOptions,
  ): boolean {
    if (!canUseCookies(category)) {
      console.warn(`Cannot set cookie "${name}" - no consent for ${category} cookies`);
      return false;
    }

    const defaultOptions: CookieOptions = {
      path: '/',
      expires: 30,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    };

    const finalOptions = { ...defaultOptions, ...options };

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (finalOptions.expires) {
      let expiresDate: Date;
      if (typeof finalOptions.expires === 'number') {
        expiresDate = new Date();
        expiresDate.setDate(expiresDate.getDate() + finalOptions.expires);
      } else {
        expiresDate = finalOptions.expires;
      }
      cookieString += `; expires=${expiresDate.toUTCString()}`;
    }

    if (finalOptions.path) {
      cookieString += `; path=${finalOptions.path}`;
    }

    if (finalOptions.domain) {
      cookieString += `; domain=${finalOptions.domain}`;
    }

    if (finalOptions.secure) {
      cookieString += '; secure';
    }

    if (finalOptions.sameSite) {
      cookieString += `; samesite=${finalOptions.sameSite}`;
    }

    document.cookie = cookieString;
    return true;
  }

  // Get a cookie value
  static get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  // Delete a cookie
  static delete(name: string, path?: string, domain?: string): void {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

    if (path) {
      cookieString += `; path=${path}`;
    } else {
      cookieString += '; path=/';
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  // Delete all non-essential cookies
  static deleteNonEssentialCookies(): void {
    const cookies = document.cookie.split(';');
    const essentialCookieNames = [
      'clerk-session',
      '__session',
      '__client_uat',
      'cookie-consent',
    ];

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

      // Skip essential cookies
      if (essentialCookieNames.some(essential => name.includes(essential))) {
        continue;
      }

      // Delete the cookie
      this.delete(name);
      // Also try deleting with common domain patterns
      this.delete(name, '/', window.location.hostname);
      this.delete(name, '/', '.' + window.location.hostname);
    }
  }

  // Check if a cookie exists
  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  // Get all cookies as an object
  static getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');

    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        cookies[decodeURIComponent(name)] = value ? decodeURIComponent(value) : '';
      }
    }

    return cookies;
  }
}