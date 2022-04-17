import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { Security, LoginCallback, useOktaAuth } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import config from "./config";

import { Outlet } from "react-router-dom";

import Protected from "./pages/MainPage";

import Loading from "./components/Loading";

const oktaAuth = new OktaAuth(config.oidc);

export function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const navigate = useNavigate();
  const restoreOriginalUri = (_oktaAuth: any, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <div className="App">
        <AppRoutes />
      </div>
    </Security>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RequiredAuth />}>
        <Route path="" element={<Protected />} />
      </Route>
      <Route
        path="login/callback"
        element={<LoginCallback loadingElement={<Loading />} />}
      />
    </Routes>
  );
};

export const RequiredAuth = () => {
  const { oktaAuth, authState } = useOktaAuth();

  const idToken = oktaAuth.getAccessToken();


  if ((!authState || !authState?.isAuthenticated) && !idToken) {
    const originalUri = toRelativeUrl(
      window.location.href,
      window.location.origin
    );
    oktaAuth.setOriginalUri(originalUri);
    oktaAuth.signInWithRedirect();

    return <Loading />;
  }

  return <Outlet />;
};

export default App;
