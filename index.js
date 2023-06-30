
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
    var startTime = '15:10:10';
    var endTime = '22:30:00';
    
    currentDate = new Date()   
    
    startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    startDate.setSeconds(startTime.split(":")[2]);
    
    endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    endDate.setSeconds(endTime.split(":")[2]);
    
    
    valid = startDate < currentDate && endDate > currentDate
    callInfo = call;
    switch (call.state) {
      case "Started":
        appendLogMessage("A call has come in...");
        if (valid) {
            await sidebar.showBadge({
            badgeType: 'count',
            count: 2
        });
        }
        else {
        await sidebar.showBadge({
            badgeType: 'count',
            count: 1
        });
        break;
        }
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
