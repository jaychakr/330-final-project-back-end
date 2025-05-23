const express = require('express');
const jwt = require('jsonwebtoken');
const UserDAO = require('../daos/user');

const router = express.Router();

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
    if (!password) {
        return res.status(400).send('should return 400 without a password');
    } else if (!password.length) {
        return res.status(400).send('should return 400 with empty password');
    }
    try {
        const user = await UserDAO.create(username, email, password);
        const token = jwt.sign({
            username: user.username,
            email: user.email,
            userId: user._id,
            _id: user._id,
            roles: user.roles,
    }, 'secret', {expiresIn: '30m'});
        return res.status(200).send({token});
    } catch (e) {
        return res.status(409).send('should return 409 conflict with repeat signup');
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    if (!password) {
        return res.status(400).send('should return 400 when password isn\'t provided');
    }
    const user = await UserDAO.login(username, password);
    if (!user) {
        return res.status(401).send('should return 401 when password doesn\'t match');
    }
    const token = jwt.sign({
        username: user.username,
        email: user.email,
        userId: user._id,
        _id: user._id,
        roles: user.roles,
    }, 'secret', {expiresIn: '30m'});
    return res.send({token});
});

router.put('/password', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('should return 401 before signup');
    }
    const {password} = req.body;
    if (!password) {
        return res.status(400).send('should reject empty password');
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, 'secret');
        await UserDAO.changePassword(user._id, password);
        return res.status(200).send('should change password');
    } catch (error) {
        return res.status(401).send('should reject bogus token');
    }
});

module.exports = router;