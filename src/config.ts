const CLIENT_ID = "0oa4o7fp4fViV9tfl5d7";
const ISSUER = "https://dev-73981180.okta.com/oauth2/default";
const OKTA_TESTING_DISABLEHTTPSCHECK = true;
const BASENAME = "";
const REDIRECT_URI = `${window.location.origin}${BASENAME}/login/callback`;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ["openid", "profile", "email"],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
};
