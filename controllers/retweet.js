const { getNextSchedule } = require("../retweet-job");
const tweetSmart = require("../tweet");

exports.retweetSmart = (req, res, next) => {
  tweetSmart(res);
};

exports.nextSchedule = (req, res, next) => {
  res.send(getNextSchedule());
};
