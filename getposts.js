require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")

async function searchTweets() {
  try {
 
    const response = await twitterClient.v2.search('music', {
      max_results: 10,
      'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
      expansions: ['author_id'],
    });

    console.log('Found tweets:', response.meta.result_count);
    console.log('----------------------');

   
    for (const tweet of response.data) {
      console.log(`@${tweet.author_id} - ${tweet.created_at}`);
      console.log(tweet.text);
      console.log('----------------------');
    }

  } catch (error) {
    console.error('Error searching tweets:', error);
  }
}

searchTweets();