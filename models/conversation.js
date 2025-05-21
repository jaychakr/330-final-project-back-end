const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userId1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  userId2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Conversation", conversationSchema);