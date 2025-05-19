const express = require('express');
const ChatMessage = require("../models/ChatMessage");

const router = express.Router();

// Routes
router.get("/", async (req, res) => {
	try {
		const messages = await ChatMessage.find();
		res.json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;