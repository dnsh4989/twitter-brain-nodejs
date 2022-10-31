const Profile = require("../models/profile");
const client = require("../config/client");

exports.postAddProfile = (req, res, next) => {
  const username = req.body.username;

  client.v2
    .userByUsername(username)
    .then((user) => {
      console.log(user);
      if (user.data && user.data.username === username) {
        const name = user.data.name;
        const username = user.data.username;
        const id = user.data.id;
        const profile = new Profile(id, name, username);
        profile.save();
        console.log(req.body);
        res.send("Profile added.");
      } else {
        res.send("No profile found.");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProfiles = (req, res, next) => {
  Profile.fetchAll(req, res, next);
};

exports.getProfileDetailsById = (req, res, next) => {
  console.log(req.params.username);
  Profile.findById(req, res, next);
};

exports.updateProfileDetailsById = (req, res, next) => {
  console.log(req.body);
  const id = req.body.id;
  const name = req.body.name;
  const username = req.body.username;
  const _id = req.body._id;
  const profile = new Profile(id, name, username, _id);
  profile.save();
  res.send("Profile updated.");
};

exports.deleteProfileById = (req, res, next) => {
  console.log(req.params.id);
  Profile.deleteById(req, res, next);
};
