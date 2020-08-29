require('../startup/loadenv')
const AWS = require('aws-sdk');
const axios = require('axios');
const { Highlight } = require('../models')
const { getS3PredictResult } = require('../services/classifier/getS3ClassifierResult')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

var params = {
    Bucket: process.env.FILE_BUCKET, /* required */
    Delimiter: '/',
    MaxKeys: 50,
    StartAfter: 200,
    Prefix: 'images/'  // Can be your folder name
};
s3.listObjectsV2(params, function (err, data) {
    if (err){ console.log(err, err.stack); return};
    const objs = data.Contents;
    objs.map(async v=> {
        const key = v.Key.split('/')[1].split('.png')[0]
        const predictResult = await getS3PredictResult(key);
        if(!predictResult.error){
            if(predictResult.msg.best_inf[0] === 0) {
                return;
            }
            console.log('[Info] Got Infer Result:' + JSON.stringify(predictResult.msg))
            Highlight.create({
                fileEngine: 's3',
                conf_score: predictResult.msg.complete_inf[0][predictResult.msg.best_inf[0]],
                user_id_str: 'twitter_user',
                created_at: new Date(),
                image: {
                    id_str: key
                }
            }).catch(e=> {
                if(e.code === 11000){
                    console.warn('[Warn] Possible Duplicate Image:' + key)
                }
            })
        }
    })

});