const client = require("../config/client");
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

module.exports = class Profile {
  constructor(id, name, username, mid) {
    this.id = id;
    this.name = name;
    this.username = username;
    this._id = mid ? new mongodb.ObjectId(mid) : null;
  }

  save() {
    const db = getDb();
    console.log(this);
    if (this._id) {
      return db
        .collection("profiles")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
        .then((res) => {
          console.log("Profile updation successfull!!!");
          console.log(res);
        })
        .catch((error) => {
          console.log("Profile updation failed!!!");
          console.log(error);
        });
    } else {
      return db
        .collection("profiles")
        .insertOne(this)
        .then((res) => {
          console.log("Profile insertion successfull!!!");
          console.log(res);
        })
        .catch((error) => {
          console.log("Profile insertion failed!!!");
          console.log(err);
        });
    }
  }

  static fetchAllUsers() {
    const db = getDb();
    return db
      .collection("profiles")
      .find()
      .toArray()
      .then((profiles) => {
        console.log("Fetch All Profiles successfull!!!");
        return profiles;
      })
      .catch((error) => {
        console.log("Fetch All Profiles failed!!!");
        console.log(error);
      });
  }

  static fetchAll(req, res, next) {
    const db = getDb();
    return db
      .collection("profiles")
      .find()
      .toArray()
      .then((profiles) => {
        console.log("Fetch All Profiles successfull!!!");
        res.send({
          profiles: profiles,
        });
        return profiles;
      })
      .catch((error) => {
        console.log("Fetch All Profiles failed!!!");
        console.log(error);
      });
  }

  static findById(req, res, next) {
    const db = getDb();
    return db
      .collection("profiles")
      .findOne({ username: req.params.username })
      .then((profile) => {
        console.log("Fetch Profile By Id successfull!!!");
        console.log(profile);
        res.send({
          profile: profile,
        });
        return profile;
      })
      .catch((error) => {
        console.log("Fetch Profile By Id failed!!!");
        console.log(error);
      });
  }

  static deleteById(req, res, next) {
    const db = getDb();
    return db
      .collection("profiles")
      .deleteOne({ _id: new mongodb.ObjectId(req.params.id) })
      .then(() => {
        console.log("Delete Profile By Id successfull!!!");
        res.send("Profile deletd.");
        return res;
      })
      .catch((error) => {
        console.log("Delete Profile By Id failed!!!");
        console.log(error);
      });
  }
};
