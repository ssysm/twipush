const express = require('express');
const { Tweet } = require('./../models');
const resBuilder = require('./../utils/responseBuilder');
const router = express.Router();

router.get('/latest', (req,res)=>{
	Tweet
		.find({isFeed: true })
		.sort({created_at: -1})
		.limit(100)
		.exec((err, docs)=>{
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
		})
})

router.get('/:id',(req,res)=>{
    const { id } = req.params;
    Tweet
        .findOne({ id_str: id })
        .exec((err, docs)=>{
            if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
        })
})

router.get('/user/:screen_name',(req,res)=>{
    const { screen_name } = req.params;
    Tweet
        .find({ "user.screen_name":  screen_name })
        .exec((err, docs)=>{
            if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
        })
})

module.exports = router;
