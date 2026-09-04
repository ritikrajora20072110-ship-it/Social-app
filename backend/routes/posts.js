const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/posts?page=1&limit=10  -> paginated public feed
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
});

// POST /api/posts  (auth required) -> create a post, text or image or both
router.post("/", auth, async (req, res) => {
  try {
    const { text, image } = req.body;

    if ((!text || !text.trim()) && (!image || !image.trim())) {
      return res.status(400).json({ message: "Post must contain text, an image, or both" });
    }

    const post = await Post.create({
      user: req.user.id,
      username: req.user.username,
      text: text ? text.trim() : "",
      image: image || "",
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating post" });
  }
});

// POST /api/posts/:id/like  (auth required) -> toggle like
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const username = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating like" });
  }
});

// POST /api/posts/:id/comment  (auth required) -> add a comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ username: req.user.username, text: text.trim() });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error adding comment" });
  }
});

module.exports = router;
