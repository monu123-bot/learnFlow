const express = require("express");
const mongoose = require("mongoose");
const { ensureAuth } = require("../middleware/auth");

const router = express.Router();

require('../models/Comment')
const Comment = mongoose.model('Comments')

router.post("/create/comment", ensureAuth, async (req, res) => {
  try {
    const commentData = req.body;
    // console.log('comment data ',commentData)
    const author = req.user;

    const comment = await Comment.create({
      ...req.body,
      author: author.displayName,
      authorImage: author.image,
    });
    // console.log(comment);
    res.status(200).send(comment);
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      error: "Something went wrong",
    });
  }
});

router.get("/fetch/reply", ensureAuth, async (req, res) => {
  const parentID = req.query.parentID;
  const parentDepth = Number(req.query.parentDepth);

  try {
    const comments = await Comment.find({
      parentID: parentID,
      depth: parentDepth + 1,
    });
    res.status(200).send(comments);
  } catch (error) {
    // console.log(error);
    res.status(500).send({});
  }
});

module.exports = router;