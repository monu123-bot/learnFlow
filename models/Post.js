const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  userID: {
    type: String,
    required: true,
  },
 
  createdAt: {
    type: Number,
    default: Date.now,
  }
});

module.exports = mongoose.model("posts", postSchema);