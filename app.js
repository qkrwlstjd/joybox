const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const indexRouter = require("./routes/index");
const AIAssistant = require("./generate");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bodyParser = require("body-parser");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use((req, res) => {
  res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
