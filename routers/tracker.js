const express = require('express');
const router = express.Router();
const { Tracker } = require('./../models');
const resBuilder = require('./../utils/responseBuilder');

router.get('/', (req, res) => {
	Tracker
		.find()
		.exec((err, docs) => {
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
		});
});

router.post('/', (req, res) => {
	const { uid, displayName, tags, remark } = req.body;
	Tracker
		.create({ uid: ''+uid, displayName, createdAt: Date.now(), tags, remark }, (err, docs) => {
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
		});
});

router.delete('/', (req, res) => {
	const { uid } = req.body;
	Tracker
		.deleteOne({ uid }, (err) => {
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, { deleted: 'ok' }));
			}
		});
});

router.get('/uid/:uid', (req, res) => {
	let { uid } = req.params;
	Tracker
		.findOne({ uid }, (err, docs) => {
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
		});
});

module.exports = router;