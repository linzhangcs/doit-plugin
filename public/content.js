let reminderElement = null;
let baseSize = 14;
let extraSize = 0;
const REMINDER_SIZE_MULTIPLIER = 3;
const REMINDER_TEXT = "DO THIS!!! ";
let currentTodoText = "";

function createReminder() {
  if (!reminderElement) {
    reminderElement = document.createElement("div");
    reminderElement.style.position = "fixed";
    reminderElement.style.top = "50%";
    reminderElement.style.left = "50%";
    reminderElement.style.transform = "translate(-50%, -50%)";
    reminderElement.style.fontSize = `${baseSize}px`;
    reminderElement.style.zIndex = "10000";
    reminderElement.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    reminderElement.style.padding = "20px";
    reminderElement.style.borderRadius = "10px";
    reminderElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

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

function updateReminderPosition(e) {
  if (reminderElement) {
    const x = e ? e.clientX : 0;
    const y = e ? e.clientY : 0;
    reminderElement.style.left = `${x + 20}px`;
    reminderElement.style.top = `${y + 20}px`;
    reminderElement.style.fontSize = `${baseSize + extraSize}px`;
  }
}

document.addEventListener("mousemove", (e) => {
  updateReminderPosition(e);
  chrome.runtime.sendMessage({ type: "ACTIVITY_DETECTED" });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_REMINDER_SIZE") {
    const seconds = message.minutes * 60; // convert minutes to seconds
    extraSize = baseSize * (Math.pow(2, message.minutes) - 1);
    if (reminderElement) {
      reminderElement.style.fontSize = `${baseSize + extraSize}px`;
      // Update just the todo text part while maintaining the blinking
      const todoSpan = reminderElement.querySelector(".blinking-text");
      if (todoSpan) {
        todoSpan.textContent = currentTodoText;
      }
    }
  }

  if (message.type === "UPDATE_TOP_TODO") {
    if (message.todo) {
      currentTodoText = message.todo.text;
      createReminder();
    } else if (reminderElement) {
      reminderElement.remove();
      reminderElement = null;
      currentTodoText = "";
    }
  }
});
