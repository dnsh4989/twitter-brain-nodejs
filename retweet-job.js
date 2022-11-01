const CronJob = require("cron").CronJob;
const tweetSmart = require("./tweet");
let GlobalReTweetJob;

const runReTweetJob = () => {
  // Every 11 minutes
  GlobalReTweetJob = new CronJob(
    "*/11 * * * *",
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
