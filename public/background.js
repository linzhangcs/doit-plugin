let inactiveTime = 0;
let activityTimer = null;
const MINUTES_TO_REMIND = 0;

function resetTimer() {
  inactiveTime = 0;
  if (activityTimer) {
    clearInterval(activityTimer);
  }
  activityTimer = setInterval(() => {
    inactiveTime++;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "UPDATE_REMINDER_SIZE",
          // minutes: Math.floor((inactiveTime - MINUTES_TO_REMIND) / 3),
          minutes: inactiveTime,
        });
      }
    });
  }, 60000); // Check every minute
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "ACTIVITY_DETECTED") {
    resetTimer();
  }
});

// Reset timer when switching tabs
chrome.tabs.onActivated.addListener(resetTimer);
