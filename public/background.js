console.log("Background script loaded"); // Debug log

let inactiveTime = 0;
let activityTimer = null;
const MINUTES_TO_REMIND = 0;
let currentTodo = { text: "Add a todo item!" }; // Default message until we load the real todo

// Function to get the top todo from storage
async function loadTopTodo() {
  console.log("Attempting to load top todo...");
  try {
    const result = await chrome.storage.local.get(["todos"]);
    console.log("Storage result:", result);

    const todos = result.todos || [];
    console.log("Todos array:", todos);

    if (todos.length > 0) {
      currentTodo = todos[0];
      console.log("Set currentTodo to:", currentTodo);
    } else {
      console.log("No todos found in storage");
    }

    // Update all tabs with the new todo
    updateAllTabs();
  } catch (e) {
    console.error("Failed to load todo:", e);
  }
}

// Function to inject and show reminder
async function injectAndShowReminder(tabId) {
  console.log("Attempting to send reminder to tab:", tabId);
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "UPDATE_TOP_TODO",
      todo: currentTodo,
    });
    console.log("Successfully sent todo to tab:", tabId);
  } catch (e) {
    console.log("Failed to send message, tab might not have content script");
  }
}

// Function to update all tabs
async function updateAllTabs() {
  try {
    const tabs = await chrome.tabs.query({
      url: ["http://*/*", "https://*/*"],
    });
    console.log("Found tabs:", tabs.length);
    for (const tab of tabs) {
      injectAndShowReminder(tab.id);
    }
  } catch (e) {
    console.error("Failed to update tabs:", e);
  }
}

// Initialize extension and show reminders on all tabs
async function initializeExtension() {
  console.log("Initializing extension...");
  await loadTopTodo();
  await updateAllTabs();
  resetTimer();
  console.log("Extension initialized");
}

function resetTimer() {
  inactiveTime = 0;
  if (activityTimer) {
    clearInterval(activityTimer);
  }
  activityTimer = setInterval(() => {
    inactiveTime++;
    updateAllTabs();
  }, 1000);
}

// Message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ACTIVITY_DETECTED") {
    resetTimer();
  }
});

// Run initialization when extension loads
chrome.runtime.onStartup.addListener(initializeExtension);
chrome.runtime.onInstalled.addListener(initializeExtension);

// Initialize immediately
initializeExtension();

// Load todo when storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.todos) {
    loadTopTodo();
  }
});

// Tab listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.match(/^https?:\/\//)
  ) {
    injectAndShowReminder(tabId);
  }
});

// Tab activation listener
chrome.tabs.onActivated.addListener(({ tabId }) => {
  resetTimer();
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url && tab.url.match(/^https?:\/\//)) {
      injectAndShowReminder(tabId);
    }
  });
});
