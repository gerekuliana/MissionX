import { SignedIn, SignedOut } from '@clerk/clerk-react';
import AppRoutes from './routes/AppRoutes';
import Login from './modules/login/Login';
import CookieConsentProvider from './modules/cookies/components/CookieConsentProvider';

function App() {
  return (
    <CookieConsentProvider>
      <SignedOut>
        <Login />
      </SignedOut>
      <SignedIn>
        <AppRoutes />
      </SignedIn>
    </CookieConsentProvider>
  );
}

export default App;
