
function appendLogMessage(message) {
  const consoleElement = document.getElementById('console');
  const logEntry = document.createElement('li');
  
  const timestamp = new Date().toLocaleTimeString();
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  consoleElement.appendChild(logEntry);
}

window.onload = async () => {
    const app = new window.webex.Application();
    await app.onReady();
    sidebar = await app.context.getSidebar();
    appendLogMessage('Logging testing');

    app.listen().then(() => {
        app.on("sidebar:callStateChanged", handleCallStateChange);
        app.on("application:viewStateChanged", handleViewStateChange)
    }).catch((reason) => {
        appendLogMessage("listen: fail reason=" + webex.Application.ErrorCodes[reason]);
    });
}

async function handleCallStateChange(call) {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  if (currentHour >= 8 && currentHour < 17) {
    // Current time is between 8 AM and 5 PM
    console.log("A call has come in...");
    await sidebar.showBadge({
      badgeType: 'count',
      count: 2
    });
  } else {
    // Current time is outside the specified range
    console.log("A call has come in, but outside the valid time range...");
    await sidebar.showBadge({
      badgeType: 'count',
      count: 1
    });
  }
}

function handleViewStateChange(viewState){
    if(viewState === 'IN_FOCUS'){
        sidebar.clearBadge();
        if(callInfo){
            window.location.href = redirectUri;
        }
    }
}
