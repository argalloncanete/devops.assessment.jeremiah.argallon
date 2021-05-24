const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    ordName: req.body.ordName,
    ordPrice: req.body.ordPrice,
    discounted: req.body.discounted,
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: "Order added successfully",
      postId: createdPost._id,
    });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    ordName: req.body.ordName,
    ordPrice: req.body.ordPrice,
    discounted: req.body.discounted,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Order Updated successful!" });
  });
});

router.get("", (req, res, next) => {
  try {
    Post.find().then((documents) => {
      res.status(200).json({
        message: "Orders fetched successfully!",
        posts: documents,
      });
    });
  } catch (e) {
    res.status(404).json({
      message: "API is down",
    });
  }
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Order not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Order deleted!" });
  });
});

module.exports = router;
