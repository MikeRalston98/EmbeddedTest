/**
 * Displays a log of information onto the page
 * @param {String} type Label of the information about to be logged
 * @param {Object} data Object that can be JSON stringified
 */

function appendLogMessage(message) {
  const consoleElement = document.getElementById('console');
  const logEntry = document.createElement('li');
  
  const timestamp = new Date().toLocaleTimeString();
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  consoleElement.appendChild(logEntry);
}

/**
 * Logs the app object from `new window.Webex.Application();`
 */
function handleDisplayAppInfo() {
  log("Webex Embedded App Application Object", app);
}

/**
 * Calls and logs the user data from `app.context.getUser()`
 */
function handleGetUser() {
  app.context
    .getUser()
    .then((u) => {
      log("getUser()", u);
    })
    .catch((error) => {
      log(
        "getUser() promise failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Calls and logs the meeting data from `app.context.getMeeting()`
 */
function handleGetMeeting() {
  app.context
    .getMeeting()
    .then((m) => {
      log("getMeeting()", m);
    })
    .catch((error) => {
      log(
        "getMeeting() promise failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Calls and logs the space data from `app.context.getSpace()`
 */
function handleGetSpace() {
  app.context
    .getSpace()
    .then((s) => {
      log("getSpace()", s);
    })
    .catch((error) => {
      log(
        "getSpace() promise failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Initiates the System Browser OAuth flow for SSO
 */
function handleSystemBrowserOAuth() {
  // System Browser OAuth Support is only for 1.5.0 SDK and above
  log('app.isSdkSupported("1.5.0")', app.isSdkSupported("1.5.0"));
  if (!app.isSdkSupported("1.5.0")) {
    return;
  }
  // The redirect from your SSO flow needs to return to this Webex address
  const webexAppRedirectUri =
    "https://oauth-helper-prod.wbx2.com/helperservice/v1/callback";
  // We are utiling mocklab to demonstrate an SSO Flow
  // Be sure to add the SSO domain to your "valid domains" configuration
  const SSOAuthUrl = `https://oauth.mocklab.io/oauth/authorize?response_type=code&redirect_uri=${webexAppRedirectUri}`;

  log("Initiating SSO flow in system browser", true);
  // Initiate SSO flow in system browser
  app
    .initiateSystemBrowserOAuth(SSOAuthUrl)
    .then(function (response) {
      // Promise fulfilled, get authorization code from JSON response
      let authCode = response;
      appendLogMessage("SSO flow got authorization code", authCode);
      // Exchange authorization code for a token with ID provider.
      // This part of the OAuth flow is the responsibility of the embedded app, for example:
      // exchangeCodeForToken(authCode);
    })
    .catch(function (reason) {
      console.error(
        "initiateSystemBrowserOAuth() failed with reason=",
        window.Webex.Application.ErrorCodes[reason]
      );
    });
}
