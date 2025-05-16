const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
    index: true
  },
  description: { type: String, required: true },
  timestamps: true
});

module.exports = mongoose.model("comments", commentSchema);