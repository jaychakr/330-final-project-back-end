const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
	user: { type: String, required: true },
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	message: { type: String, required: true },
	conversationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "conversations",
		required: true,
		index: true
	},
	timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;