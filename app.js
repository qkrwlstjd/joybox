const OPENAI_API_KEY = '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';

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const indexRouter = require('./routes/index');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const openai = require('openai');
// openai.apiKey=OPENAI_API_KEY;


// const { OpenAI } = require('openai');
// const openai = new OpenAI(OPENAI_API_KEY);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', indexRouter);
app.use((req, res) => {
  res.status(404).send('Page not found');
});


// Socket.io
io.on('connection', socket => {
  console.log('New WebSocket connection');

  socket.emit('message', 'Hello, how can I help you?');
  socket.on('chatMessage', message => {
    const model = 'text-davinci-002';
    const maxTokens = 5;

    console.log(`receive : ${message}`);
    io.emit('message', `receive : ${message}`);

    // openai.complete({
    //   engine: model,
    //   prompt: message,
    //   maxTokens: maxTokens,
    // }).then((response) => {
    //   console.log(`response : ${response.choices[0].text}`);
    //   io.emit('message', `${response.choices[0].text}`);
    // }).catch((error) => {
    //   console.error(error);
    //   io.emit('message', `error: '${error}'`);
    // });
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
