const CronJob = require("cron").CronJob;
const tweetSmart = require("./tweet");
let GlobalReTweetJob;

const runReTweetJob = () => {
  // Every 27 minutes
  GlobalReTweetJob = new CronJob(
    "*/27 * * * *",
    tweetSmart,
    null,
    true,
    "Asia/Kolkata"
  );
  GlobalReTweetJob.start();
};

const getNextSchedule = () => {
  return GlobalReTweetJob.nextDate();
};

exports.getNextSchedule = getNextSchedule;
exports.runReTweetJob = runReTweetJob;
