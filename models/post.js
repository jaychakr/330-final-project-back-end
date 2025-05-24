const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    index: true
  },
  description: { type: String, required: true, index: 'text' },
  fileType: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Post", postSchema);