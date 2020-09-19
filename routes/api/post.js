const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");

const router = express.Router();

//create a new post
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      });
      await newPost.save();
      res.json(newPost);
    } catch (e) {
      console.error(e.message);
      res.status(500).send("Server Error");
    }
  }
);

//get all posts by a farmer
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(404).json({ message: "No posts here" });
    }
    res.send(posts);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

//get post by id
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }
    res.json(post);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});
//delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      res.status(400).json({ message: "No post to delete" });
    }
    if (post.user.toString() !== req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "Post deleted" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

//add likes to post

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      //post has already been liked
      return res.status(400).json({ message: "Post has already been liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.send(post);
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

//unlike post
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post not been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ message: "Post has not been liked" });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    //actual deleting
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json({ message: "Unliked" });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

//add comment to post
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.send(post.comments);
    } catch (e) {
      console.log(e.message);
      res.status(500).send("Server Error");
    }
  }
);
// delete comment
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "No post found to delete" });
    }
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    //check comment exists?
    if (!comment) {
      return res.status(404).json({ message: "No comment(pun intended)" });
    }
    //check user exists?
    if (comment.user.toString() === req.user.id) {
      return res.status(404).json({ message: "Not authorized" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.id === comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    if (e.kind === "ObjectId") {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
