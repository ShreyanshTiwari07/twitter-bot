require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")

const tweet = async () => {
  try {
    await twitterClient.v2.tweet("GM from nftspace!!!!");
  } catch (e) {
    console.log(e)
  }
}

tweet();