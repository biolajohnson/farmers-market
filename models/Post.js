const mongoose = require("mongoose");
const schemaPost = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "farmer",
  },
  images: {
    type: Buffer,
  },
  likes: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      text: {
        type: String,
      },
      avatar: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", schemaPost);
