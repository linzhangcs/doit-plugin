let reminderElement = null;
let baseSize = 14;
let extraSize = 0;

function createReminder() {
  if (!reminderElement) {
    reminderElement = document.createElement("div");
    reminderElement.className = "todo-reminder";
    document.body.appendChild(reminderElement);
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
    extraSize = message.minutes * 3;
    if (reminderElement) {
      reminderElement.style.fontSize = `${baseSize + extraSize}px`;
    }
  }

  if (message.type === "UPDATE_TOP_TODO") {
    if (message.todo) {
      createReminder();
      reminderElement.textContent = message.todo.text;
    } else if (reminderElement) {
      reminderElement.remove();
      reminderElement = null;
    }
  }
});
