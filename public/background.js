console.log("Background script loaded"); // Debug log

let inactiveTime = 0;
let activityTimer = null;
const MINUTES_TO_REMIND = 0;
let currentTodo = null;

// Function to check if tab is valid
async function isValidTab(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    return (
      tab &&
      tab.url &&
      (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
    );
  } catch (e) {
    return false;
  }
}

// Function to send message to tab
async function sendMessageToTab(tabId, message) {
  if (!(await isValidTab(tabId))) {
    return false;
  }

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Error sending message:", chrome.runtime.lastError);
        resolve(false);
      } else {
        console.log("Message sent successfully:", message);
        resolve(true);
      }
    });
  });
}

// Function to show reminder in tab
async function showReminderInTab(tabId) {
  if (!currentTodo) {
    console.log("No todo to show");
    return false;
  }

  console.log("Showing todo in tab:", tabId, currentTodo);

  // Try to send the message with retries
  const maxRetries = 3;
  for (let i = 0; i < maxRetries; i++) {
    const success = await sendMessageToTab(tabId, {
      type: "UPDATE_TOP_TODO",
      todo: currentTodo,
    });

    if (success) {
      return true;
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
  }

  return false;
}

// Function to update all tabs
// async function updateAllTabs() {
//   const tabs = await chrome.tabs.query({
//     url: ["http://*/*", "https://*/*"],
//   });

//   console.log(`Attempting to update ${tabs.length} tabs`);

//   for (const tab of tabs) {
//     await showReminderInTab(tab.id);
//   }
// }
//get update the currently active tab
async function updateActiveTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };

  let [tab] = await chrome.tabs.query(queryOptions);
  console.log("ACTIVE TAB", tab.id, tab);
  //either a 'tabs.tab' or 'undefined'
  if (tab) {
    await showReminderInTab(tab.id);
  }
}
// Load todo from storage
async function loadTopTodo() {
  console.log("Loading top todo from storage...");
  try {
    const result = await chrome.storage.sync.get(["todos"]);
    console.log("Storage result:", result);

    const todos = result.todos || [];
    console.log("Todos array:", todos);

    if (todos.length > 0) {
      currentTodo = todos.filter((todo) => !todo.completed)[0];
      console.log("Set currentTodo to:", currentTodo);
      // await updateAllTabs();
      await updateActiveTab();
    } else {
      console.log("No todos found in storage");
      currentTodo = null;
    }
  } catch (e) {
    console.error("Failed to load todo:", e);
    currentTodo = null;
  }
}

function resetTimer() {
  inactiveTime = 0;
  if (activityTimer) {
    clearInterval(activityTimer);
  }
  activityTimer = setInterval(async () => {
    inactiveTime++;
    // await updateAllTabs();
    // await updateActiveTab();
  }, 1000);
}

// Message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ACTIVITY_DETECTED") {
    // resetTimer();
  }
  return true;
});

// Tab update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.startsWith("http")) {
    // Give the content script time to load
    loadTopTodo();
    setTimeout(() => showReminderInTab(tabId), 1000);
  }
});

// Tab activation listener
chrome.tabs.onActivated.addListener(({ tabId }) => {
  console.log("User switched to tab:", tabId);

  chrome.tabs.get(tabId, (tab) => {
    if (tab.url?.startsWith("http")) {
      // resetTimer();
      console.log("User switched to tab:", tabId);
      loadTopTodo();
      // Give the content script time to load
      setTimeout(() => showReminderInTab(tabId), 1000);
    }
  });
});

// Storage change listener with immediate update
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.todos) {
    console.log("Storage changed. New todos:", changes.todos.newValue);
    loadTopTodo();
  }
});

// Initialize
async function initialize() {
  console.log("Initializing extension...");
  await loadTopTodo();
  resetTimer();
  console.log("Extension initialized");
}

// Initialize on install and startup
chrome.runtime.onInstalled.addListener(initialize);
chrome.runtime.onStartup.addListener(initialize);

// Initialize immediately
initialize();
