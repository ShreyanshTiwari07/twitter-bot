require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js")

async function searchTweets() {
  try {
 
    const response = await twitterClient.v2.search('I need new music', {
        max_results: 10,
        'tweet.fields': [
          'created_at',
          'public_metrics',
          'author_id',
          'text',
          'referenced_tweets' // Add this for retweet handling
        ],
        expansions: [
          'author_id',
          'referenced_tweets.id.author_id' // Required for full retweet text
        ],
      });
    console.log('Found tweets:', response.meta.result_count);
    console.log("tweets:", response.data);
    console.log('----------------------');

    const userMap = new Map(response.includes.users?.map(u => [u.id, u.username]) || []);
    const tweetMap = new Map(response.includes.tweets?.map(t => [t.id, t]) || []);
    // const userMap = new Map();
    // response.includes.users.forEach(user => {
    //   userMap.set(user.id, user.username);
    // });

    // Iterate using tweet IDs as the base
    for (const [index, tweet] of response.data.data.entries()) {
        const username = userMap.get(tweet.author_id) || 'unknown';
        let fullText = tweet.text;
  
        // Handle retweets and quoted tweets
        if (tweet.referenced_tweets) {
          const referencedTweet = tweetMap.get(tweet.referenced_tweets[0].id);
          if (referencedTweet) {
            fullText = `RT @${userMap.get(referencedTweet.author_id)}: ${referencedTweet.text}`;
          }
        }
  
        console.log(`Tweet ID: ${tweet.id}`);
        console.log(`Position: ${index + 1}/${response.meta.result_count}`);
        console.log(`Author: @${username}`);
        console.log(`Created: ${tweet.created_at}`);
        console.log(`Content: ${fullText}`); // Use fullText instead of tweet.text
        console.log('----------------------');
      }
  } catch (error) {
    console.error('Error searching tweets:', error);
  }
}

searchTweets();