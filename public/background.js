let inactiveTime = 0;
let activityTimer = null;

function resetTimer() {
  inactiveTime = 0;
  if (activityTimer) {
    clearInterval(activityTimer);
  }
  activityTimer = setInterval(() => {
    inactiveTime++;
    if (inactiveTime >= 30) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "UPDATE_REMINDER_SIZE",
            minutes: Math.floor((inactiveTime - 30) / 3),
          });
        }
      });
    }
  }, 60000); // Check every minute
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "ACTIVITY_DETECTED") {
    resetTimer();
  }
});

// Reset timer when switching tabs
chrome.tabs.onActivated.addListener(resetTimer);
