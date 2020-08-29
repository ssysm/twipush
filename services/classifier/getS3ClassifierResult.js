const axios = require('axios');

const ENDPOINT = process.env.INFER_SERVER_URL + '/predict/twipush'

const getS3PredictResult = async (media_id) => {
    try{
        const result = axios.get(ENDPOINT + '?media_id=' + media_id)
                                .then(res => res.data)
        return result;
    }catch(e){
        return new Error("Error During Prediction");
    }
};

module.exports = {
    getS3PredictResult
}