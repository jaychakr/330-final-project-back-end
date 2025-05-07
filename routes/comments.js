const express = require('express');
const jwt = require('jsonwebtoken');
const CommentDAO = require('../daos/comment');

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
    const {postId, description} = req.body;
    const post = await CommentDAO.create(req.user.userId, postId, description);
    return res.sendStatus(201);
});

router.get('/', authMiddleware, async (req, res) => {
    const {postId} = req.body;
    const comments = await CommentDAO.getAll(postId);
    return res.status(200).send(comments);
});

router.get('/:id', authMiddleware, async (req, res) => {
    const comment = await CommentDAO.getById(req.params.id);
    return res.status(200).send(comment);
});

router.put('/:id', authMiddleware, async (req, res) => {
    const {description} = req.body;
    const comment = await CommentDAO.edit(req.params.id, description);
    return res.status(201).send(comment);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    await CommentDAO.delete(req.params.id);
    return res.status(204).send('comment deleted!');
});

module.exports = router;