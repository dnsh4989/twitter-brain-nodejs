const { getDb } = require("../util/database");

module.exports = class Retweet {
  constructor(id, text, edit_history_tweet_ids, userId) {
    this.id = id;
    this.text = text;
    this.edit_history_tweet_ids = edit_history_tweet_ids;
    this.userId = userId;
    this.reTweetedAt = new Date();
  }

  save() {
    const db = getDb();
    db.collection("retweets")
      .insertOne(this)
      .then((res) => {
        console.log("Retweet insertion successfull!!!");
        console.log(res);
      })
      .catch((error) => {
        console.log("Retweet insertion failed!!!");
        console.log(err);
      });
  }
};
