const express = require('express');
const jwt = require('jsonwebtoken');
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

router.get('/details/:userId', async (req, res) => {
    const user = await UserDAO.findById(req.params.userId);
    if (!user) {
        return res.sendStatus(401);
    }
    return res.status(201).send({
        username: user.username,
        bio: user.bio
    });
});

router.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;
    const user = await UserDAO.create(username, email, password);
    if (!user) {
        return res.sendStatus(401);
    }
    const token = jwt.sign({
        username: user.username,
        userId: user._id,
        roles: user.roles,
    }, process.env.JWT_SECRET, {expiresIn: '300m'});
    return res.status(201).send({token});
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await UserDAO.login(username, password);
    if (!user) {
        return res.sendStatus(401);
    }
    const token = jwt.sign({
        username: user.username,
        userId: user._id,
        roles: user.roles,
    }, process.env.JWT_SECRET, {expiresIn: '300m'});
    return res.send({token});
});

router.patch('/changePassword', authMiddleware, async (req, res) => {
    const loggedInUserId = req.user.userId;
    await UserDAO.changePassword(loggedInUserId, req.body.password);
    return res.sendStatus(200);
});

module.exports = router;