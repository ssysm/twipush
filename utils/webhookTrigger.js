const webhookInterface = require('./../services/webhook/hookModifier');
module.exports = ({user, uid, text})=>{
    webhookInterface.trigger({
        data: {
            user,
            uid,
            text
        }
    });
}
