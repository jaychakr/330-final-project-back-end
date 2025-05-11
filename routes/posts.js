const express = require('express');
const jwt = require('jsonwebtoken');
const PostDAO = require('../daos/post');

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
    const {description} = req.body;
    const post = await PostDAO.create(req.user.userId, description);
    return res.status(201).send(post);
});

router.get('/', async (req, res) => {
    const posts = await PostDAO.getAll();
    return res.status(200).send(posts);
});

router.get('/:userId', async (req, res) => {
    const posts = await PostDAO.getAllByUser(req.params.userId);
    return res.status(200).send(posts);
});

router.get('/:userId/:postId', async (req, res) => {
    const post = await PostDAO.getById(req.params.postId);
    return res.status(200).send(post);
});

router.put('/:userId/:postId', authMiddleware, async (req, res) => {
    const {description} = req.body;
    const post = await PostDAO.edit(req.params.postId, description);
    return res.status(201).send(post);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    await PostDAO.delete(req.params.id);
    return res.sendStatus(204);
});

module.exports = router;