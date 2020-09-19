const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const FarmerProfile = require("../../models/FarmerProfile");
const User = require("../../models/User");

const router = express.Router();
//create farmer profile
router.post(
  "/",
  [
    auth,
    [
      check("skills", "Please input what type of farmer you are")
        .not()
        .isEmpty(),
      check("status", "Please input your agricultural scope").not().isEmpty(),
      check("location", "Location fiend is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      location,
      bio,
      website,
      status,
      skills,
      company,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedIn,
      produce,
    } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (website) profileFields.website = website;
    if (status) profileFields.status = status;
    if (skills) profileFields.skills = skills;
    if (company) profileFields.company = company;
    if (produce) {
      profileFields.produce = produce
        .split(",")
        .map((produce) => produce.trim());
    }
    //build social fields

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedIn) profileFields.social.linkedIn = linkedIn;
    if (facebook) profileFields.social.facebook = facebook;
    try {
      let profile = await FarmerProfile.findOne({ user: req.user.id });
      //update
      if (profile) {
        profile = await FarmerProfile.findOneAndUpdate(
          { user: req.user.id },
          {
            $set: profileFields,
          },
          { new: true }
        );
      }
      //create new
      profile = new FarmerProfile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);
//get personal farmer profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(400).json({ message: "Theres no profile for this user" });
    }
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
//get all farmer profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await FarmerProfile.find().populate("user", [
      "name",
      "avatar",
    ]);
    if (!profiles) {
      res.status(400).json({ message: "No farmers at this point" });
    }
    res.json(profiles);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

//get a specified farmer (id)
router.get("/:user_id", async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      res.status(400).json({ message: "Profile not found" });
    }
    res.send(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
//delete farmer profile
router.delete("/", auth, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndRemove({ user: req.user.id });
    const user = await User.findOneAndRemove({ _id: req.user.id });
    res.json({ message: "User has been removed succussfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
//add experience to farmer profile

router.put(
  "/experience",
  [
    auth,
    [
      check("focusedProduce", "Produce is required").not().isEmpty(),
      check("from", "Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const { from, focusedProduce, current, to, description } = req.body;
    const newExp = {
      from,
      focusedProduce,
      current,
      to,
      description,
    };
    try {
      const profile = await FarmerProfile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);
//delete experience on farmer profile
router.delete("/experience", auth, async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ user: req.user.id });
    const removeIndex = profile.experience
      .map((experience) => experience.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
