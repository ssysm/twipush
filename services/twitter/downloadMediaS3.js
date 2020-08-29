const axios = require('axios');
const AWS = require('aws-sdk');
const { Highlight } = require('../../models')
const { getS3PredictResult } = require('../classifier/getS3ClassifierResult')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const bucketParams = {
    Bucket: process.env.FILE_BUCKET,
    ACL: 'public-read'
}

module.exports = async(entities_list)=>{
    if(entities_list == null){
        return ;
    }
    entities_list.map((d)=>{
        if(d.type === 'video'){
            d.video_info.variants = stripeVideos(d.video_info.variants);
            downloadImage(d);
            downloadVideo(d.video_info.variants[0].url,d.id_str,()=>{
                console.log('[INFO] Downloaded media(video) from ' + d.media_url_https);
            });
        }
        else if(d.type === 'photo'){
            downloadImage(d, ()=>{
                console.log('[INFO] Downloaded media from(photo) ' + d.media_url_https);
            })
        }else {
            console.log("[WARN] Cannot download media, not [photo/video].")
        }
    });
};

const downloadImage = ({media_url_https,id_str,expanded_url },callback) =>{
    axios({
        url: media_url_https,
        method: 'GET',
        responseType: 'arraybuffer',
        onDownloadProgress: (e)=>{
            console.log('[DEBUG] Downloading media..' + e)
        }
    })
        .then(async (response)=>{
            const imgBuff = new Buffer.from(response.data, 'binary');
            const imgUploadParam = { ...bucketParams, Key: 'images/'+ id_str + '.png', Body: imgBuff };
            const s3Result = await s3.upload(imgUploadParam).promise();
            const predictResult = await getS3PredictResult(id_str);
            callback(s3Result)
            highlightRoutine(predictResult, expanded_url.split('/')[3], id_str)
        })
        .catch((e)=>{
            console.error('[ERROR] Fail to download media(photo) from twitter.')
        })
};

const downloadVideo = (video_url, id_str, callback)=>{
    axios({
        url: video_url,
        method: 'GET',
        responseType: 'arraybuffer',
        onDownloadProgress: (e)=>{
            console.log('[DEBUG] Downloading media..' + e)
        }
    })
        .then(async (response)=>{
            const videoBuff = new Buffer.from(response.data, 'binary');
            const vidUploadParam = { ...bucketParams, Key:'videos/'+ id_str + '.mp4', Body: videoBuff };
            const s3Result = await s3.upload(vidUploadParam).promise();
            callback(s3Result)
        })
        .catch((e)=> {
            console.error('[ERROR] Fail to download media(video) from twitter.')
        })
}

const highlightRoutine = (predictResult, imageOwner, image_id_str) => {
    if(!predictResult.error){
        if(predictResult.msg.best_inf[0] === 0) {
            return;
        }
        console.log('[Info] Got Infer Result:' + JSON.stringify(predictResult.msg))
        Highlight.create({
            fileEngine: 's3',
            conf_score: predictResult.msg.complete_inf[0][predictResult.msg.best_inf[0]],
            user_id_str: imageOwner,
            created_at: new Date(),
            image: {
                id_str: image_id_str
            }
        }).catch(e=> {
            if(e.code === 11000){
                console.warn('[Warn] Possible Duplicate Image:' + image_id_str)
            }
        })
    }
}

const stripeVideos = (videoArr)=>{
    return videoArr.filter(obj => obj.content_type === "video/mp4")
}
