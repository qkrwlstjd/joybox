const chatForm = document.querySelector(".chat-input");
const chatMessages = document.querySelector(".chat-content");

const id = uuidv4(); // 랜덤 UUID 생성

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageInput = e.target.elements.message;
  const message = messageInput.value;
  outputMessage(message, true);
  outputMessage("");
  messageInput.disabled = true; // 폼 비활성화

  let loadingMessage = "";
  let timer = setInterval(function () {
    loadingMessage += ".";
    lastMessageChange(loadingMessage);
  }, 300);

  // Send POST request to /chat endpoint
  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: id, message: message }),
    timeout: 10000, // 10초 대기
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const message = data.message;
      clearInterval(timer);
      lastMessageChange(message);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      messageInput.value = "";
      messageInput.disabled = false; // 폼 다시 활성화
      messageInput.focus();
    });
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

function lastMessageChange() {}

function lastMessageChange(message) {
  const lastMessage = chatMessages.lastChild.querySelector(
    ".chat-message:not(.chat-bubble-response)"
  );
  lastMessage.textContent = message;
}
