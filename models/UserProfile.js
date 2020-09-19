const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});
module.exports = UserProfile = mongoose.model("userProfile", profileSchema);
