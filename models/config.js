const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class Config {
  constructor(
    tweetTypePattern,
    currentIndex,
    mid = "635fdf851b4c74995baed7b8"
  ) {
    this.currentIndex = currentIndex;
    this.tweetTypePattern = tweetTypePattern;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  saveIndex() {
    const db = getDb();
    return db
      .collection("config")
      .updateOne(
        { _id: new mongodb.ObjectId("635fdf851b4c74995baed7b8") },
        { $set: this }
      )
      .then((res) => {
        console.log("Config update successfull!!!");
        // console.log(res);
      })
      .catch((error) => {
        console.log("Config update failed!!!");
        // console.log(err);
      });
  }

  static getTweetTypePattern() {
    const db = getDb();
    return db
      .collection("config")
      .find()
      .toArray()
      .then((configs) => {
        console.log("Fetch Config successfull!!!");
        return configs[0].tweetTypePattern;
      })
      .catch((error) => {
        console.log("Fetch Config failed!!!");
        console.log(error);
      });
  }

  static getCurrentIndex() {
    const db = getDb();
    return db
      .collection("config")
      .find()
      .toArray()
      .then((configs) => {
        console.log("Fetch Config successfull!!!");
        return configs[0].currentIndex;
      })
      .catch((error) => {
        console.log("Fetch Config failed!!!");
        console.log(error);
      });
  }
};
