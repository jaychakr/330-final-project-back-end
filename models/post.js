const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  description: { type: String, required: true }
});

module.exports = mongoose.model("posts", postSchema);