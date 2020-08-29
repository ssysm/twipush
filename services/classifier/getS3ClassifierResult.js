const axios = require('axios');
const { inferEp } = require('../../const/endpoint')
const ENDPOINT = inferEp + '/predict/twipush'

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