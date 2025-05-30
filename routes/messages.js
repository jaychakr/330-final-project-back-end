const express = require('express');
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

router.get("/", async (req, res) => {
	const messages = await ChatMessage.find();
	res.json(messages);
});

router.get("/:conversationId", async (req, res) => {
	const messages = await ChatMessage.find({conversationId: req.params.conversationId});
	res.json(messages);
});

module.exports = router;