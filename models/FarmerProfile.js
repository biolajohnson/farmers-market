const mongoose = require("mongoose");
const farmerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
    default: "Independent",
  },
  skills: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  produce: {
    type: [String],
  },
  bio: {
    type: String,
    required: true,
  },
  experience: [
    {
      focusedProduce: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      current: {
        type: Boolean,
        default: false,
      },
      to: {
        type: Date,
      },
      description: {
        type: String,
      },
    },
  ],
  socials: {
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Farmer = mongoose.model("farmer", farmerProfileSchema);
