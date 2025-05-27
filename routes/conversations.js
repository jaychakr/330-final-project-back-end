const express = require('express');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const ConversationDAO = require('../daos/conversation');
const UserDAO = require('../daos/user');

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
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

router.post('/', authMiddleware, async (req, res) => {
    const {username} = req.body;
    const recipient = await UserDAO.findByUsername(username);
    if (!recipient) {
        return res.sendStatus(400);
    }
    const conversation = await ConversationDAO.create(req.user.userId, recipient._id);
    return res.status(201).send(conversation);
});

router.get('/:conversationId', authMiddleware, async (req, res) => {
    const conversations = await ConversationDAO.getById(req.params.conversationId);
    return res.status(200).send(conversations);
});

router.get('/byUserId/:userId', authMiddleware, async (req, res) => {
    const conversations = await ConversationDAO.getAllByUserId(req.params.userId);
    return res.status(200).send(conversations);
});

module.exports = router;