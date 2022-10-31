const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class PreviousHashtag {
  constructor(term, mid) {
    this.term = term;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("previousHashtags")
      .insertOne(this)
      .then((res) => {
        console.log("Previous Hashtag insertion successfull!!!");
        // console.log(res);
      })
      .catch((error) => {
        console.log("Previous insertion failed!!!");
        // console.log(err);
      });
  }

  static fetchAllPreviousHashtags() {
    const db = getDb();
    return db
      .collection("previousHashtags")
      .find()
      .toArray()
      .then((previousHashtags) => {
        console.log("Fetch All Previous Hashtags successfull!!!");
        return previousHashtags;
      })
      .catch((error) => {
        console.log("Fetch All Previous Hashtags failed!!!");
        console.log(error);
      });
  }

  static removeAllPreviousHashtags = () => {
    const db = getDb();
    return db.collection("previousHashtags").remove();
  };
};
