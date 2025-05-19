require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const messageRoutes = require('./routes/messages');
const cors = require('cors');
const { Server } = require("socket.io");
const http = require("http");
const ChatMessage = require("./models/ChatMessage");

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

// Use the message routes
app.use('/messages', messageRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// Socket.IO Connection
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);
	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`);
	});
	socket.on("chat message", async (msg) => {
		console.log("message: " + msg);
		io.emit("chat message", msg);
		try {
			const { user, message } = msg;
			if (!user || !message) {
				console.error("User and message are required");
				return;
			}
			const chatMessage = new ChatMessage({
				user,
				message,
			});
			await chatMessage.save();
			console.log("Message saved to database");
		} catch (error) {
			console.error("Error saving message:", error);
		}
	});
});

//module.exports = app;
module.exports = server;
