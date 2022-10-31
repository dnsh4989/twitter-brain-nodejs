const Profile = require("../models/profile");
const client = require("../config/client");
const tweetSmart = require("../tweet");

exports.retweetSmart = (req, res, next) => {
  tweetSmart(res);
};
