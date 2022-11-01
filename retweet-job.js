const CronJob = require("cron").CronJob;
const tweetSmart = require("./tweet");
const { getDb } = require("./util/database");
const mongoConnect = require("./util/database").mongoConnect;
let GlobalReTweetJob = null;

const loopFunc = () => {
  mongoConnect(() => {
    const db = getDb();
    const checkDbConnectionJob = setInterval(() => {
      if (getDb()) {
        clearInterval(checkDbConnectionJob);
        tweetSmart();
      }
    }, 500);
  });
};

const runReTweetJob = () => {
  // Every 11 minutes
  GlobalReTweetJob = new CronJob(
    "*/21 * * * *",
    tweetSmart,
    null,
    true,
    "Asia/Kolkata"
  );
  GlobalReTweetJob.start();
};

const getNextSchedule = () => {
  return GlobalReTweetJob ? GlobalReTweetJob.nextDate() : null;
};

exports.getNextSchedule = getNextSchedule;
exports.runReTweetJob = runReTweetJob;
exports.loopFunc = loopFunc;
