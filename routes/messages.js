const express = require('express');
const ChatMessage = require("../models/ChatMessage");
const jwt = require('jsonwebtoken');
const router = express.Router();

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		console.log('test1');
		return res.sendStatus(401);
	}
	const token = authHeader.split(' ')[1];
	try {
		const user = jwt.verify(token, 'secret');
		req.user = user;
		next();
	} catch (error) {
		return res.sendStatus(401);
	}
}

router.get("/", authMiddleware, async (req, res) => {
	const messages = await ChatMessage.find();
	res.json(messages);
});

router.get("/:conversationId", authMiddleware, async (req, res) => {
	const messages = await ChatMessage.find({conversationId: req.params.conversationId});
	res.json(messages);
});

module.exports = router;