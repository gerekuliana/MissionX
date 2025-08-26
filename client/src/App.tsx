import { SignedIn, SignedOut } from '@clerk/clerk-react';
import AppRoutes from './routes/AppRoutes';
import Login from './modules/login/Login';
import { CookieConsentBanner } from './modules/cookies/components/CookieConsentBanner';

function App() {
  return (
    <>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
        <AppRoutes />
      </SignedIn>
      <CookieConsentBanner />
    </>
  );
}

export default App;
