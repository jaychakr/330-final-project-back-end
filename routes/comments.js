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

router.get('/:postId', async (req, res) => {
    const comments = await CommentDAO.getAll(req.params.postId);
    return res.status(200).send(comments);
});

router.get('/:postId/:commentId', async (req, res) => {
    const comment = await CommentDAO.getById(req.params.commentId);
    return res.status(200).send(comment);
});

router.put('/:postId/:commentId', authMiddleware, async (req, res) => {
    const {description} = req.body;
    const comment = await CommentDAO.edit(req.params.commentId, description);
    return res.status(201).send(comment);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    await CommentDAO.delete(req.params.id);
    return res.status(204).send('comment deleted!');
});

module.exports = router;