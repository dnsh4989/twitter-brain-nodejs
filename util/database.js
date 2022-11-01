const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://dinu:bearebel@twitter-brain.0uboh2r.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("MongoDB Connected!!!");
      _db = client.db();
      callback(client);
    })
    .catch((error) => {
      console.log("MongoDB Connection Failed!!!");
      console.log(error);
      throw error;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  return null;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
