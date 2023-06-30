// Check URL Hash for Login with Webex Token
parseJwtFromURLHash();

//const app = new window.Webex.Application();
const app = new webex.Application();
//await app.onReady();
const sidebar = await app.context.getSidebar();
app.onReady().then(() => {
    log("onReady()", { message: "EA is reeady." });
    log("onReady()", { message: "EA is readyyy." });

    app.listen().then(() => {
      app.on("sidebar:callStateChanged", (call) => {
        log("Call state changed. Call object:", call);
        log("Call state changed. Call object:", { message: call });

        handleCallStateChange(call);
      });
      app.on("application:viewStateChanged", (viewState) => {
        log("View state changed. Current view:", viewState);
        switch (viewState) {
          case "IN_FOCUS":
            // User has noticed the badge and has responded, so we can remove it...
            initializeSideBar(callCount++);
            break;
        }
      });
    });
  });

function handleCallStateChange(call) {
  switch (call.state) {
    case "Started":
      log("A call has come in...");
      
      // Check to see if the call is from a VIP...
      if (call.id === importantContactId) {
        log("A VIP call is incoming! Notify the user...");
        // Initialize the sidebar, passing in the incremented the badge count...
        initializeSideBar(callCount++);
      }
      
      // For all calls, log the information...
      log("*** CALL INFORMATION ***")
      log("- Caller ID: ", call.id);
      log("- Call type: ", call.callType);
      log("- Call state: ", call.state);
      log("- Local Participant: ", call.localParticipant);
      log("- Remote Participants list: ", call.remoteParticpants);
      break;
    case "Connected":
      log("Call is connected.");
      break;
    case "Ended":
      log("Call is ended.");
      break;
    default:
      break;
  }
}

function initializeSideBar(callCount) {
  app.context.getSidebar().then((s) => {
      sidebar = s;
      log("Show a badge on the sidebar...")
      handleBadge(callCount, sidebar);
    })
    .catch((error) => {
      log("getSidebar() failed. Error: ", Webex.Application.ErrorCodes[error]);
    });
}

function handleBadge(callCount, sidebar) {
  // Make sure the sidebar is available..
  if (!sidebar) {
    log("Sidebar info is not available. Error: ", Webex.Application.ErrorCodes[4]);
    return;
  }

  // Initialize a badge object...
  const badge = {
    badgeType: 'count',
    count: callCount,
  };

  // Show the badge...
  sidebar.showBadge(badge).then((success) => {
      log("sidebar.showBadge() successful.", success);
    }).catch((error) => {
      log("sidebar.showBadge() failed. Error: ", Webex.Application.ErrorCodes[error]);
    });
}

app.onReady().then(() => {
  log("onReady()", { message: "host app is ready" });

  // Listen and emit any events from the EmbeddedAppSDK
  app.listen().then(() => {
    app.on("application:displayContextChanged", (payload) =>
      log("application:displayContextChanged", payload)
    );
    app.on("application:shareStateChanged", (payload) =>
      log("application:shareStateChanged", payload)
    );
    app.on("application:themeChanged", (payload) =>
      log("application:themeChanged", payload)
    );
    app.on("meeting:infoChanged", (payload) =>
      log("meeting:infoChanged", payload)
    );
    app.on("meeting:roleChanged", (payload) =>
      log("meeting:roleChanged", payload)
    );
    app.on("space:infoChanged", (payload) => log("space:infoChanged", payload));
  });
});

/**
 * Sets the share url to the value entereed in the "shareUrl" element.
 * @returns
 */
function handleSetShare() {
  if (app.isShared) {
    log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  app
    .setShareUrl(url, url, "Embedded App Kitchen Sink")
    .then(() => {
      log("setShareUrl()", {
        message: "shared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "setShareUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Clears the share url
 */
function handleClearShare() {
  app
    .clearShareUrl()
    .then(() => {
      log("clearShareUrl()", { message: "share url has been cleared" });
    })
    .catch((error) => {
      log(
        "clearShareUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Sets the presentation URL
 */
async function handleSetPresentationUrl() {
  if (app.isShared) {
    log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  let meeting = await app.context.getMeeting();
  meeting.setPresentationUrl(url, "My Presentation", Webex.Application.ShareOptimizationMode.AUTO_DETECT, false)
    .then(() => {
      log("setPresentationUrl()", {
        message: "presented url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "setPresentationUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Clears the set presentation url
 */
async function handleClearPresentationUrl() {
  let meeting = await app.context.getMeeting();
  meeting.clearPresentationUrl()
    .then(() => {
      log("clearPresentationUrl()", {
        message: "cleared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "clearPresentationUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}
