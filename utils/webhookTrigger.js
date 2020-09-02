const webhookInterface = require('./../services/webhook/hookModifier');
module.exports = (data)=>{
    webhookInterface.trigger(data);
}
