const express = require('express');
const router = express.Router();
const { Highlight } = require('../models')
const resBuilder = require('./../utils/responseBuilder');

router.get('/', function(req, res, next) {
    const { page, limit } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    Highlight
        .find()
        .sort({created_at: -1})
        .skip(limitInt * (pageInt - 1))
        .limit(limitInt)
		.exec((err, docs)=>{
			if (err) {
				res.status(500).send(resBuilder(err, null));
			} else {
				res.send(resBuilder(null, docs));
			}
		})
});

router.get('/random', async (req,res)=> {
    Highlight
    .findRandom()
    .limit(1)
    .exec((err, docs)=>{
        if (err) {
            res.status(500).send(resBuilder(err, null));
        } else {
            res.send(resBuilder(null, docs));
        }
    })
})

router.patch('/report', async (req,res) => {
    const { media_id } = req.body;
    try{
        const doc = await Highlight.findOneAndUpdate({ 'image.id_str': media_id }, 
                                                    { $inc: { false_infer_report_count: 1 } },
                                                    { new: true});
        res.send(resBuilder(null, doc));
    }catch(err){
        res.status(500).send(resBuilder(err, null));
    }
})


module.exports = router;
