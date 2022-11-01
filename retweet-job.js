const CronJob = require("cron").CronJob;
const tweetSmart = require("./tweet");
let GlobalReTweetJob;

const runReTweetJob = () => {
  // Every 27 minutes
  GlobalReTweetJob = new CronJob(
    "*/11 * * * *",
    tweetSmart,
    null,
    true,
    "America/New_York"
  );
  GlobalReTweetJob.start();
};

const getNextSchedule = () => {
  return GlobalReTweetJob.nextDate();
};

exports.getNextSchedule = getNextSchedule;
exports.runReTweetJob = runReTweetJob;
