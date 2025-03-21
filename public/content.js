console.log("Content script loaded"); // Debug log

let reminderElement = null;
let baseSize = 14;
let extraSize = 0;
const REMINDER_SIZE_MULTIPLIER = 3;
const REMINDER_TEXT = "are you doing this: ";
let currentTodoText = "";

// Initialize as soon as the script loads
function initialize() {
  console.log("Initializing content script"); // Debug log

  // Let the background script know we're ready
  chrome.runtime.sendMessage({ type: "CONTENT_SCRIPT_READY" });
}

function createReminder() {
  if (!reminderElement) {
    console.log("Creating reminder element"); // Debug log
    reminderElement = document.createElement("div");
    reminderElement.style.position = "fixed";
    reminderElement.style.top = "0";
    reminderElement.style.left = "0";
    reminderElement.style.transform = "translate(20px, 20px)"; // Offset from cursor
    reminderElement.style.fontSize = `${baseSize}px`;
    reminderElement.style.zIndex = "10000";
    reminderElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    reminderElement.style.padding = "20px";
    reminderElement.style.borderRadius = "10px";
    reminderElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    reminderElement.style.pointerEvents = "none"; // Make it not interfere with clicking

    // Add the static text and a span for the blinking todo
    reminderElement.innerHTML = `${REMINDER_TEXT}<span class="blinking-text">${currentTodoText}</span>`;

    // Add the blinking animation style
    const style = document.createElement("style");
    style.textContent = `
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
      }
      .blinking-text {
        animation: blink 1s infinite;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(reminderElement);
  }
  // Update just the todo text part
  const todoSpan = reminderElement.querySelector(".blinking-text");
  if (todoSpan) {
    todoSpan.textContent = currentTodoText;
  }
}

// Update reminder position based on cursor
function updateReminderPosition(e) {
  if (reminderElement) {
    const x = e.clientX;
    const y = e.clientY;
    reminderElement.style.left = `${x + 20}px`; // 20px offset from cursor
    reminderElement.style.top = `${y + 20}px`;
  }
}

// Add mousemove event listener
document.addEventListener(
  "mousemove",
  (e) => {
    updateReminderPosition(e);
    chrome.runtime.sendMessage({ type: "ACTIVITY_DETECTED" });
  },
  { passive: true }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message); // Debug log

  if (message.type === "PING") {
    sendResponse({ status: "OK" });
    return;
  }

  if (message.type === "UPDATE_REMINDER_SIZE") {
    const seconds = message.minutes * 60; // convert minutes to seconds
    extraSize = baseSize * (Math.pow(2, message.minutes) - 1);
    if (reminderElement) {
      reminderElement.style.fontSize = `${baseSize + extraSize}px`;
      const todoSpan = reminderElement.querySelector(".blinking-text");
      if (todoSpan) {
        todoSpan.textContent = currentTodoText;
      }
    }
    sendResponse({ status: "OK" });
  }

  if (message.type === "UPDATE_TOP_TODO") {
    console.log("Updating todo:", message.todo); // Debug log
    if (message.todo) {
      currentTodoText = message.todo.text;
      createReminder();
    } else if (reminderElement) {
      reminderElement.remove();
      reminderElement = null;
      currentTodoText = "";
    }
    sendResponse({ status: "OK" });
  }

  return true; // Keep the message channel open for async response
});

// Initialize when the script loads
initialize();

// Also initialize when the document is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
