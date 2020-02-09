const mongoose = require('mongoose');
const WebhookSchema = new mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String,
        required: true,
        index:{
            unique: true
        }
    }
});
const model = mongoose.model('webhook', WebhookSchema);
model.createIndexes();
module.exports = model;
