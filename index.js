// Check URL Hash for login with Webex Token
parseJwtFromURLHash();

//const app = new window.Webex.Application();
const app = new webex.Application();
//await app.onReady();
const sidebar = await app.context.getSidebar();
app.onReady().then(() => {
    console.log("onReady()", { message: "EA is ready." });
    log("onReady()", { message: "EA is reeadyyy." });

    app.listen().then(() => {
      app.on("sidebar:callStateChanged", (call) => {
        console.log("Call state changed. Call object:", call);
        console.log("Call state changed. Call object:", { message: call });

        handleCallStateChange(call);
      });
      app.on("application:viewStateChanged", (viewState) => {
        console.log("View state changed. Current view:", viewState);
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
      console.log("A call has come in...");
      
      // Check to see if the call is from a VIP...
      if (call.id === importantContactId) {
        console.log("A VIP call is incoming! Notify the user...");
        // Initialize the sidebar, passing in the incremented the badge count...
        initializeSideBar(callCount++);
      }
      
      // For all calls, console.log the information...
      console.log("*** CALL INFORMATION ***")
      console.log("- Caller ID: ", call.id);
      console.log("- Call type: ", call.callType);
      console.log("- Call state: ", call.state);
      console.log("- Local Participant: ", call.localParticipant);
      console.log("- Remote Participants list: ", call.remoteParticpants);
      break;
    case "Connected":
      console.log("Call is connected.");
      break;
    case "Ended":
      console.log("Call is ended.");
      break;
    default:
      break;
  }
}

function initializeSideBar(callCount) {
  app.context.getSidebar().then((s) => {
      sidebar = s;
      console.log("Show a badge on the sidebar...")
      handleBadge(callCount, sidebar);
    })
    .catch((error) => {
      console.log("getSidebar() failed. Error: ", Webex.Application.ErrorCodes[error]);
    });
}

function handleBadge(callCount, sidebar) {
  // Make sure the sidebar is available..
  if (!sidebar) {
    console.log("Sidebar info is not available. Error: ", Webex.Application.ErrorCodes[4]);
    return;
  }

  // Initialize a badge object...
  const badge = {
    badgeType: 'count',
    count: callCount,
  };

  // Show the badge...
  sidebar.showBadge(badge).then((success) => {
      console.log("sidebar.showBadge() successful.", success);
    }).catch((error) => {
      console.log("sidebar.showBadge() failed. Error: ", Webex.Application.ErrorCodes[error]);
    });
}

app.onReady().then(() => {
  console.log("onReady()", { message: "host app is ready" });

  // Listen and emit any events from the EmbeddedAppSDK
  app.listen().then(() => {
    app.on("application:displayContextChanged", (payload) =>
      console.log("application:displayContextChanged", payload)
    );
    app.on("application:shareStateChanged", (payload) =>
      console.log("application:shareStateChanged", payload)
    );
    app.on("application:themeChanged", (payload) =>
      console.log("application:themeChanged", payload)
    );
    app.on("meeting:infoChanged", (payload) =>
      console.log("meeting:infoChanged", payload)
    );
    app.on("meeting:roleChanged", (payload) =>
      console.log("meeting:roleChanged", payload)
    );
    app.on("space:infoChanged", (payload) => console.log("space:infoChanged", payload));
  });
});

/**
 * Sets the share url to the value entereed in the "shareUrl" element.
 * @returns
 */
function handleSetShare() {
  if (app.isShared) {
    console.log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  app
    .setShareUrl(url, url, "Embedded App Kitchen Sink")
    .then(() => {
      console.log("setShareUrl()", {
        message: "shared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      console.log(
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
      console.log("clearShareUrl()", { message: "share url has been cleared" });
    })
    .catch((error) => {
      console.log(
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
    console.log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  let meeting = await app.context.getMeeting();
  meeting.setPresentationUrl(url, "My Presentation", Webex.Application.ShareOptimizationMode.AUTO_DETECT, false)
    .then(() => {
      console.log("setPresentationUrl()", {
        message: "presented url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      console.log(
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
      console.log("clearPresentationUrl()", {
        message: "cleared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      console.log(
        "clearPresentationUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}
