const axios = require('axios');
const fs = require('fs');
const path = require('path');
module.exports = async(entities_list)=>{
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

const downloadImage = ({media_url_https,id_str},callback) =>{
    axios({
        url: media_url_https,
        method: 'GET',
        responseType: 'stream',
        onDownloadProgress: (e)=>{
            console.log('[DEBUG] Downloading media..' + e)
        }
    })
        .then((response)=>{
            response.data.pipe(fs.createWriteStream(path.join(__dirname,process.env.STATIC_FILES, id_str+'.png')));
        })
        .catch((e)=>{
            console.error('[ERROR] Fail to download media(photo) from twitter.')
        })
        .finally(callback);
};

const downloadVideo = (video_url, id_str, callback)=>{
    axios({
        url: video_url,
        method: 'GET',
        responseType: 'stream',
        onDownloadProgress: (e)=>{
            console.log('[DEBUG] Downloading media..' + e)
        }
    })
        .then((response)=>{
            response.data.pipe(fs.createWriteStream(path.join(__dirname, process.env.STATIC_FILES, id_str+'.mp4')))
        })
        .catch((e)=> {
            console.error('[ERROR] Fail to download media(video) from twitter.')
        })
        .finally(callback);
}

const stripeVideos = (videoArr)=>{
    return videoArr.filter(obj => obj.content_type === "video/mp4")
}
