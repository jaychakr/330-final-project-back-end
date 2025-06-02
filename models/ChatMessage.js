const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
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
}, {
  timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;