const chatForm = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-content");

const socket = io();

socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.message.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Add message to chat content
  outputMessage(msg, true);

  // Clear input
  e.target.elements.message.value = "";
  e.target.elements.message.focus();
});

// Output message to DOM
function outputMessage(message, isSent) {
  const div = document.createElement("div");
  div.classList.add("chat-bubble");
  if (isSent) {
    div.classList.add("chat-bubble-response");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  div.innerHTML = `<p class="chat-message">${message}</p>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
