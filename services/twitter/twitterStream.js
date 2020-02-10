const Twit = require('twit');
const {Tracker, Tweet} = require('../../models');
const checkDBList = require('./../../utils/filterElement');
const webhookTrigger = require('./../../utils/webhookTrigger');
const { handleTweet } = require('./tweetHandler');
module.exports.runner = async () => {
    //Init Twti
    const T = new Twit({
        consumer_key: process.env.TW_CKEY,
        consumer_secret: process.env.TW_CS,
        access_token: process.env.TW_AT,
        access_token_secret: process.env.TW_ATS,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true,     // optional - requires SSL certificates to be valid.
    });
    let followIDs = [];

    reloadFollowsIDs = async () => {
        followIDs = [];
        let result = await Tracker.find().select('uid');
        result.forEach(d => {
            followIDs.push(d.uid)
        });
        console.log('[INFO] Reloaded follows id array now length: ' + followIDs.length)
    }
    //Fetch Job List
    await reloadFollowsIDs();

    const stream = T.stream('statuses/filter', {
        follow: followIDs,
        filter_level: 'none'
    })
    //Stream Event
    stream.on('tweet', function (tweet) {
        if (checkDBList(followIDs, tweet.user.id_str) > -1) {
            Tweet
                .create(tweet, (err, docs) => {
                    if (err) {
                        console.error(err)
                    } else {
                        handleTweet(docs)
                        webhookTrigger({user: docs.user.screen_names, uid: docs.id_str, text: docs.text})
                    }
                    console.log(`[INFO] New tweet from ${docs.user.screen_name} stored with id ${docs.id_str}`)
                })
        } else {
            console.log(`[WARN] Rejected Tweet from ${tweet.user.screen_name}(${tweet.user.id_str}), not in list.`)
        }
    })

    stream.on('disconnect', (event) => {
        console.error(`[INFO] Twitter Stream Disconnected`);
    })

    stream.on('connected', (event) => {
        console.log('[INFO] Connected to Twitter Stream')
        console.log(`[INFO] Stream with current Follow IDs: ${event.request.body}`)
    })

    stream.on('error', (event) => {
        console.error(`[ERROR] ${event.message} with reply ${event.twitterReply}`)
    })
};
