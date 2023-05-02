const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database("chat.db");

// Create table for chat messages
db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY,
  username TEXT,
  role TEXT,
  message TEXT,
  token INT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

function saveMessage(username, role, message, max_token) {
  if (!max_token) {
    max_token = 0;
  }
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO messages (username, role, message,token) VALUES (?, ?, ?, ?)`,
      [username, role, message, max_token],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            username,
            role,
            message,
            max_token,
          });
        }
      }
    );
  });
}

function getMessage(user, limit) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM messages WHERE username = ? ORDER BY id DESC LIMIT ${limit}`,
      [user],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          let messages = [];
          let next = "user";
          for (let i = 0; i < rows.length; i++) {
            if (rows[i].role != next) {
              continue;
            }
            if (rows[i].role == "user") {
              next = "assistant";
            } else {
              next = "user";
            }
            messages.push({
              role: rows[i].role,
              content: rows[i].message,
            });
          }
          messages.push({
            role: "system",
            content: `JoyBot은 선물을 추천해주는 도우미 입니다.
            사용자가 원하는 것을 정확하게 파악하고 대답합니다.항상 줄바꿈을 합니다.`,
          });
          messages = messages.reverse();

          resolve(messages);
        }
      }
    );
  });
}

module.exports = {
  saveMessage,
  getMessage,
};
