const express = require("express");
const router = express.Router();

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

router.post("/chat", (req, res) => {
  const message = req.body.msg;

  res.sendStatus(200);
});

module.exports = router;
