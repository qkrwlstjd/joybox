const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const indexRouter = require("./routes/index");
const AIAssistant = require("./generate");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  openai = new AIAssistant();
  socket.emit(
    "message",
    "저는 선물을 추천해주는 조이봇입니다. 무엇을 도와드릴까요?"
  );
  socket.on("chatMessage", async (message) => {
    const res_message = await openai.generateResponse(message);
    io.emit("message", res_message);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
