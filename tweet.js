const client = require("./config/client");
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
  console.log(user);
  getTweetsByUser(user)
    .then((last5Tweets) => {
      const currentTweet = getRandomItem(last5Tweets.data.data);
      console.log("currentTweet");
      console.log(currentTweet);
      currentTweet["userId"] = user.id;
      client.v2
        .retweet("598377247", currentTweet.id)
        .then((res) => {
          console.log(res);
          if (response && response.send) {
            response.send(res);
          }
          // addRetweetToDb(currentTweet);
          addUserToDb(user);
          incrementTweetTypeIndex();
        })
        .catch((err) => {
          console.log(err);
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
        if (filteredHashes.length) {
          const currentHashtag = getRandomItem(filteredHashes);
          searchTweetsByTerm(currentHashtag.term).then((tweets) => {
            console.log(
              "Following 10 Tweets aquared from the Hashtag - " +
                currentHashtag.term
            );
            const currentTweet = getRandomItem(tweets.data);
            client.v2
              .retweet("598377247", currentTweet.id)
              .then((resp) => {
                console.log(resp);
                if (res && res.send) {
                  res.send(resp);
                }
                // addRetweetToDb(currentTweet);
                addHashtagToDb(currentHashtag);
                incrementTweetTypeIndex();
              })
              .catch((err) => {
                console.log(err);
              });
          });
        } else {
          console.log("Dropping PreviousHashtags Collection");
          PreviousHashtag.removeAllPreviousHashtags().then(() => {
            tweetSmart(res);
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
        if (filteredUseres.length) {
          const currentUser = getRandomItem(filteredUseres);
          retweetLatestFromUser(currentUser, (response = res));
        } else {
          console.log("Dropping PreviousProfiles Collection");
          PreviousProfile.removeAllPreviousProfiles().then(() => {
            tweetSmart(res);
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const incrementTweetTypeIndex = async () => {
  const currentIndex = await Config.getIndex();
  const newIndex =
    currentIndex.currentIndex === 7 ? 0 : currentIndex.currentIndex + 1;
  const NewConfig = new Config(null, newIndex, "63610f5e1b4c74995baed8b9");
  console.log(NewConfig);
  return NewConfig.saveIndex();
};

const getTweetType = async () => {
  const tweetTypePattern = await Config.getPattern();
  const currentIndex = await Config.getIndex();
  console.log("CONFIGGGGG");
  console.log(tweetTypePattern.tweetTypePattern);
  console.log(currentIndex.currentIndex);
  return tweetTypePattern.tweetTypePattern[currentIndex.currentIndex];
};

const tweetSmart = (res = null) => {
  const checkDbConnectionJob = setInterval(() => {
    if (getDb()) {
      clearInterval(checkDbConnectionJob);
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
    }
  }, 500);
};

module.exports = tweetSmart;
