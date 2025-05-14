require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const cors = require('cors');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET env var not provided');
}

// Create the app, setup JSON parsing
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date()}`);
    next();
});

// Enable cors
app.use(cors());

// Use the user routes
app.use('/', userRoutes);

// Use the post routes
app.use('/posts', postRoutes);

// Use the comment routes
app.use('/comments', commentRoutes);

module.exports = app;
