const cron = require("node-cron");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database").mongoConnect;
const profileRoutes = require("./routes/profile");
const retweetRoutes = require("./routes/retweet");
const tweetSmart = require("./tweet");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/retweet", retweetRoutes);
app.use("/profile", profileRoutes);

mongoConnect(() => {
  app.listen(9000, () => {
    console.log("App running on port 9000");
  });
});

const runReTweetJob = () => {
  // Every 30 minutes
  cron.schedule("*/3 * * * *", tweetSmart);
};

runReTweetJob();
