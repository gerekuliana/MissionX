import { SignedIn, SignedOut } from '@clerk/clerk-react';
import AppRoutes from './routes/AppRoutes';
import Login from './modules/login/Login';
import CookieBanner from './modules/cookieConsent/components/CookieBanner';

function App() {
  return (
    <>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
        <AppRoutes />
      </SignedIn>
      <CookieBanner />
    </>
  );
}

export default App;
