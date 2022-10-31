const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class PreviousProfile {
  constructor(id, name, username, mid) {
    this.id = id;
    this.name = name;
    this.username = username;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  save() {
    const db = getDb();
    return db
      .collection("previousProfiles")
      .insertOne(this)
      .then((res) => {
        console.log("Previous Profile insertion successfull!!!");
        console.log(res);
      })
      .catch((error) => {
        console.log("Previous Profile insertion failed!!!");
        console.log(err);
      });
  }

  static fetchAllPreviousProfiles() {
    const db = getDb();
    return db
      .collection("previousProfiles")
      .find()
      .toArray()
      .then((profiles) => {
        console.log("Fetch All Previous Profiles successfull!!!");
        return profiles;
      })
      .catch((error) => {
        console.log("Fetch All Previous Profiles failed!!!");
        console.log(error);
      });
  }

  static removeAllPreviousProfiles = () => {
    const db = getDb();
    return db.collection("previousProfiles").remove();
  };
};
