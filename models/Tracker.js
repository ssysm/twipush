const mongoose = require('mongoose');
const TrackerSchema = new mongoose.Schema({
	displayName: {
		type: String
	},
	uid: {
		type: String,
		unique: true
	},
	createdAt: {
		type: Date,
	},
	remark: {
		type: String
	},
	tags: [{
		type: String
	}]
});
TrackerSchema.index({
	tags: 'text'
});
const model = mongoose.model('tracker', TrackerSchema);
model.createIndexes();
module.exports = model;