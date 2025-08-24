import React, { useEffect } from 'react';
import { useCookieConsentStore } from '../stores/cookieConsentStore';
import CookieBanner from './CookieBanner';
import CookieConfigModal from './CookieConfigModal';
import NoJavaScriptFallback from './NoJavaScriptFallback';

interface CookieConsentProviderProps {
  children: React.ReactNode;
}

const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const loadConsent = useCookieConsentStore((state) => state.loadConsent);

  useEffect(() => {
    loadConsent();
  }, [loadConsent]);

  return (
    <>
      <NoJavaScriptFallback />
      {children}
      <CookieBanner />
      <CookieConfigModal />
    </>
  );
};

export default CookieConsentProvider;