const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //delete a post
    router.delete("/:id", async (req, res) => {
        try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted");
        } else {
            res.status(403).json("you can delete only your post");
        }
        } catch (err) {
        res.status(500).json(err);
        }
    });

    
    //like / dislike a post
    router.put("/:id/like", async (req, res) => {
        try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
        } catch (err) {
        res.status(500).json(err);
        }
    });

  //get a post
  router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //get timeline posts
  router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get user's all posts

  router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
  //add cmt
  router.post("/:id/comment", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json("Post not found");
      }
  
      const { userId, username, text } = req.body;
  
      if (!userId || !username || !text) {
        return res.status(400).json("Missing required fields");
      }
  
      // Fetch user details for the comment
      const user = await User.findById(userId);
      const newComment = {
        userId,
        username, // This should be provided in the reques
        text, // This should be provided in the request
      };
  
      // Push new comment into the post's comments array
      post.comments.push(newComment);
      await post.save();
  
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  
module.exports = router;