const mediaDownloader = require('./downloadMedia');
const getTweet = require('./getTweet');
const {Tweet} = require('../../models');
function handleTweet(tweet) {
    // Check if tweet is retweeted
    if(typeof tweet.retweeted_status === 'object')
    {
        handleTweet(tweet.retweeted_status);
    }
    // Check if tweet is retweet with comment aka. quote
    if(tweet.is_quote_status)
    {
        handleTweet(tweet.quoted_status)
    }
    // Check if tweet is a reply to a parent tweet
    else if(tweet.in_reply_to_status_id_str !== null)
    {
        handleReplyTweet(tweet.in_reply_to_status_id_str)
    }
    if (tweet.truncated) { // if the tweet is the new version of 280 char, get from extended_entities
        if(tweet.extended_tweet.extended_entities !== null){
            mediaDownloader(tweet.extended_tweet.extended_entities.media)
        }
    } else {
        // retweet object sometimes doesn't contain a valid extended_entites
        if(tweet.extended_entities){
            if (tweet.extended_entities.length > 0) {
                mediaDownloader(tweet.extended_entities[0].media)
            }
            else if(typeof tweet.extended_entities == "object")
            {
                mediaDownloader(tweet.extended_entities.media)
            }
        }
    }
}

function handleReplyTweet(id_str) {
    getTweet(id_str,(err,data,response)=>{
        if(err){
            console.error('[ERROR] Can not get tweet ' + id_str)
        }else{
            Tweet.create({...data, isFeed: false},(err,docs)=>{
                if(err){
                    console.error("[ERROR] Failed to store tweet" + id_str)
                }else{
                    handleTweet(docs)
                }
            })
        }
    })
}


module.exports = {
    handleTweet
}
