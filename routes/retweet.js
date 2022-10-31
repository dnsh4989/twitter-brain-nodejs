const express = require("express");

const retweetController = require("../controllers/retweet");

const router = express.Router();

// /retweet/user => POST
router.get("/smart", retweetController.retweetSmart);

module.exports = router;
