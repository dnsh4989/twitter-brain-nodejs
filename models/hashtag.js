const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class Hashtag {
  constructor(term, mid) {
    this.term = term;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("hashtags")
      .insertOne(this)
      .then((res) => {
        console.log("Hashtag insertion successfull!!!");
        // console.log(res);
      })
      .catch((error) => {
        console.log("Hashtag insertion failed!!!");
        // console.log(err);
      });
  }

  static fetchAllHashtags() {
    const db = getDb();
    return db
      .collection("hashtags")
      .find()
      .toArray()
      .then((hashtags) => {
        console.log("Fetch All Hashtags successfull!!!");
        return hashtags;
      })
      .catch((error) => {
        console.log("Fetch All Hashtags failed!!!");
        console.log(error);
      });
  }
};
