const https = require("https");
const http = require("http");
const fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/joybox.im/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/joybox.im/fullchain.pem"),
};

const express = require("express");
const path = require("path");
const indexRouter = require("./routes/index");
const AIAssistant = require("./generate");
const app = express();
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers.host}${req.url}` });
  res.end();
});
const server = https.createServer(options, app);
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

const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server started on port ${HTTP_PORT}`);
});

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS server started on port ${HTTPS_PORT}`);
});

