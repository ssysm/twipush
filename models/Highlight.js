const mongoose = require('mongoose');
const random = require('mongoose-random');
const HighlightSchema = new mongoose.Schema({
    fileEngine:{
        type:String
    },
    "user_id_str": {
       "type" :"String"
    },
    "created_at": {
        "type": "Date"
    },
    "conf_score": {
        type: Number,
    },
    "image": {
        id_str: {
            type: String,
            required: true,
            index:{
                unique:true
            }
        }
    },
    "false_infer_report_count": {
        type: Number,
        default: 0
    }
});
HighlightSchema.plugin(random, { path: 'r' })
const model = mongoose.model('highlight', HighlightSchema);
model.createIndexes();
module.exports = model;
