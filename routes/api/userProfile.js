const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const UserProfile = require("../../models/UserProfile");
const User = require("../../models/User");

const router = express.Router();
//create  and update profile for user
router.post(
  "/",
  [auth, [check("status", "Status required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { status, location, bio } = req.body;
    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    try {
      let profile = await UserProfile.findOne({ user: req.user.id });
      //update
      if (profile) {
        profile = await UserProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      }
      //create new
      profile = new UserProfile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);

//get personal profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(400).json({ message: "No profile for this user" });
    }
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

//get all profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await UserProfile.find().populate("user", [
      "name",
      "avatar",
    ]);
    res.send(profiles);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

//get user profile by id

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", ""]);
    if (!profile) {
      return res.status(400).json({
        message: "No such user exists",
      });
    }
    res.send(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
//delete profile
router.delete("/", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndRemove({ user: req.user.id });
    const user = await User.findByIdAndRemove({ _id: req.user.id });
    res.json({ message: "User removed succesfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
