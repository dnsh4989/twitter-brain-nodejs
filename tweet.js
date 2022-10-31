const client = require("./config/client");
const cron = require("node-cron");
const { getDb } = require("./util/database");
const Profile = require("./models/profile");
const Retweet = require("./models/retweet");
const PreviousProfile = require("./models/previousProfile");
const PreviousHashtag = require("./models/previousHashtag");
const Hashtag = require("./models/hashtag");
const Config = require("./models/config");

const searchTweetsByTerm = (query = "100DaysOfCode", max_results = 10) => {
  const result = client.v2.get("tweets/search/recent", {
    query: query,
    max_results: max_results,
  });
  return result;
};

const getUserByHandle = (username) => {
  return client.v2.userByUsername(username);
};

const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const getTweetsByUser = (user, max_results = 5) => {
  return client.v2.userTimeline(user.id, {
    exclude: ["replies", "retweets"],
    max_results: max_results,
  });
};

const addRetweetToDb = (currentTweet) => {
  const retweet = new Retweet(
    currentTweet.id,
    currentTweet.text,
    currentTweet.edit_history_tweet_ids,
    currentTweet.userId
  );
  retweet.save();
};

const addUserToDb = (user) => {
  const retweet = new PreviousProfile(user.id, user.name, user.username);
  retweet.save();
};

const retweetLatestFromUser = (user, response = null) => {
  const db = getDb();
  console.log(111);
  console.log(user);
  getTweetsByUser(user)
    .then((last5Tweets) => {
      const currentTweet = last5Tweets.data.data[0];
      db.collection("retweets")
        .find({ id: currentTweet.id }, { _id: 1 })
        .toArray()
        .then((pastTweets) => {
          if (!pastTweets.length) {
            console.log("TYPE --- NOOO CHANGE");
            currentTweet["userId"] = user.id;
            console.log(currentTweet);
            getUserByHandle("dnsh4989").then((adminUser) => {
              client.v2
                .retweet(adminUser.data.id, currentTweet.id)
                .then((res) => {
                  console.log(res);
                  if (response) {
                    response.send(res);
                  }
                  addRetweetToDb(currentTweet);
                  addUserToDb(user);
                  incrementTweetTypeIndex();
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          } else {
            incrementTweetTypeIndex().then((stat) => {
              console.log("TYPE --- CHANGEDDDDD");
              console.log(stat);
              tweetSmart(response);
            });
          }
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const addHashtagToDb = (currentHashtag) => {
  const prevHashtag = new PreviousHashtag(currentHashtag.term);
  prevHashtag.save();
};

const tweetFromTerms = (res = null) => {
  Hashtag.fetchAllHashtags()
    .then((hashtags) => {
      PreviousHashtag.fetchAllPreviousHashtags().then((prevHashes) => {
        const filteredHashes = hashtags.filter((hash) => {
          let hasHash = false;
          prevHashes.map((prevhash) => {
            if (prevhash.term === hash.term) {
              hasHash = true;
            }
          });
          return !hasHash;
        });
        console.log("Filtered Hashes:");
        console.log(filteredHashes);
        if (filteredHashes.length) {
          const currentHashtag = getRandomItem(filteredHashes);
          searchTweetsByTerm(currentHashtag.term).then((tweets) => {
            console.log(tweets.data);
            const currentTweet = getRandomItem(tweets.data);
            getUserByHandle("dnsh4989").then((adminUser) => {
              client.v2
                .retweet(adminUser.data.id, currentTweet.id)
                .then((resp) => {
                  console.log(resp);
                  if (res) {
                    res?.send(resp);
                  }
                  addRetweetToDb(currentTweet);
                  addHashtagToDb(currentHashtag);
                  incrementTweetTypeIndex();
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
        } else {
          console.log("KKKKKKKKKKKKK");
          PreviousHashtag.removeAllPreviousHashtags().then(() => {
            tweetSmart();
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const tweetFromUserProfiles = (res = null) => {
  Profile.fetchAllUsers()
    .then((users) => {
      PreviousProfile.fetchAllPreviousProfiles().then((prevProfiles) => {
        const filteredUseres = users.filter((usr) => {
          let hasUser = false;
          prevProfiles.map((prevProf) => {
            if (prevProf.id === usr.id) {
              hasUser = true;
            }
          });
          return !hasUser;
        });
        console.log("Filtered Users");
        console.log(filteredUseres);
        if (filteredUseres.length) {
          const currentUser = getRandomItem(filteredUseres);
          retweetLatestFromUser(currentUser, (response = res));
        } else {
          console.log("DDDDDDDDDDD");
          PreviousProfile.removeAllPreviousProfiles().then(() => {
            tweetSmart();
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const incrementTweetTypeIndex = async () => {
  let tweetTypePattern = await Config.getTweetTypePattern();
  let currentIndex = await Config.getCurrentIndex();
  currentIndex = currentIndex === 23 ? 0 : currentIndex + 1;
  const NewConfig = new Config(tweetTypePattern, currentIndex);
  console.log(NewConfig);
  return NewConfig.saveIndex();
};

const getTweetType = async () => {
  const tweetTypePattern = await Config.getTweetTypePattern();
  const currentIndex = await Config.getCurrentIndex();
  return tweetTypePattern[currentIndex];
};

const tweetSmart = (res = null) => {
  console.log("--------------------------------------------------");
  console.log("Tweet Task - Time: " + new Date());
  console.log("--------------------------------------------------");

  const checkDbConnectionJob = setInterval(() => {
    if (getDb) {
      getTweetType().then((tweetType) => {
        console.log("TWEEET TYPE --");
        console.log(tweetType);
        if (tweetType === "user") {
          console.log("TYPE ---> user");
          tweetFromUserProfiles(res);
        } else if (tweetType === "hashtag") {
          console.log("TYPE ---> hashtag");
          tweetFromTerms(res);
        }
      });
      clearInterval(checkDbConnectionJob);
    }
  }, 500);
};

const runReTweetJob = () => {
  // Runs Smart Re-Tweet Job Every 30 minutes
  cron.schedule("0 */30 * * * *", tweetSmart);
};

// runReTweetJob();

module.exports = tweetSmart;
