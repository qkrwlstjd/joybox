const express = require("express");
const router = express.Router();
const AIAssistant = require("../generate");
const db = require("../db");

// Index route
router.get("/", (req, res) => {
  res.render("index");
});

// Chat route
router.get("/chat", (req, res) => {
  res.render("chat");
});

// Chat route
router.get("/post", (req, res) => {
  res.render("post");
});

router.post("/chat", async (req, res) => {
  const username = req.body.username;
  const message = req.body.message;
  try {
    let res_message = await AIAssistant.generateResponse(username, message);
    return res.json({
      message: res_message,
    });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router.get("/chat/list", async (req, res) => {
  const username = req.query.username;
  message = await db.getMessage(username);
  res.json(message);
});

// router.post("/chat/new", async (req, res) => {
//   const username = req.body.username;
//   try {
//     await AIAssistant.newChat(username);
//     return res.json({
//       message: "저는 선물을 추천해주는 조이봇입니다. 무엇을 도와드릴까요?",
//     });
//   } catch (e) {
//     return res.status(404).json({ error: e });
//   }
// });

module.exports = router;
