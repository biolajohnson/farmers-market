const express = require("express");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const router = express.Router();
//get registered user.
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});
//log in user

router.post(
  "/",
  [
    auth,
    [
      check("email", "Invalid email").isEmail(),
      check("password", "Invalid password").exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //see if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ errors: [{ message: "Invalid credentials" }] });
      }
      //make sure the password matches
      const payload = {
        user: {
          id: user.id,
        },
      };
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ message: "Invalid credentials" }] });
      }
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw new Error(err);
          }
          res.json({ token });
        }
      );
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
