const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class Config {
  constructor(tweetTypePattern, currentIndex, mid = null) {
    this.currentIndex =
      currentIndex || currentIndex === 0 ? currentIndex : null;
    this.tweetTypePattern = tweetTypePattern ? tweetTypePattern : null;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  saveIndex() {
    const db = getDb();
    return db
      .collection("config")
      .updateOne(
        { _id: new mongodb.ObjectId("63610f5e1b4c74995baed8b9") },
        { $set: this }
      );
  }

  static getIndex() {
    const db = getDb();
    return db
      .collection("config")
      .findOne({ _id: new mongodb.ObjectId("63610f5e1b4c74995baed8b9") });
  }

  static getPattern() {
    const db = getDb();
    return db
      .collection("config")
      .findOne({ _id: new mongodb.ObjectId("635fdf851b4c74995baed7b8") });
  }
};
