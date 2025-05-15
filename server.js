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
app.use('/api', userRoutes);

// Use the post routes
app.use('/api/posts', postRoutes);

// Use the comment routes
app.use('/api/comments', commentRoutes);

app.use(express.static(__dirname + '/330-final-project-front-end/dist'));

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/330-final-project-front-end/dist/index.html');
});

module.exports = app;
