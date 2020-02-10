const Twit = require('twit');

module.exports = (id,callback) =>{
    const T = new Twit({
        consumer_key: process.env.TW_CKEY,
        consumer_secret: process.env.TW_CS,
        access_token: process.env.TW_AT,
        access_token_secret: process.env.TW_ATS,
        timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL: true,     // optional - requires SSL certificates to be valid.
    });

    T.get('/statuses/show/:id',{ id },callback);
}
