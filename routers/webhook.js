const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Webhook } = require('./../models');
const webhookInterface = require('./../services/webhook/hookModifier');
const resBuilder = require('./../utils/responseBuilder');

// Get all webhook
router.get('/', (req,res)=>{
    Webhook
        .find()
        .exec((err,docs)=>{
            if (err) {
                res.status(500).send(resBuilder(err, null));
            } else {
                res.send(resBuilder(null, docs));
            }
        })
})

// Create a webhook
router.post('/', (req, res)=>{
    Webhook.create({
        name: req.body.name,
        url: req.body.url
    }, (err, docs) => {
        if (err) {
            res.status(500).send(resBuilder(err, null));
        } else {
            webhookInterface.add(docs.url);
            res.send(resBuilder(null, docs));
        }
    })
});

// Delete a webhook
router.delete('/', (req, res) => {
    const { url } = req.body;
    Webhook
        .deleteOne({ url }, (err) => {
            if (err) {
                res.status(500).send(resBuilder(err, null));
            } else {
                webhookInterface.remove(url);
                res.send(resBuilder(null, { deleted: 'ok' }));
            }
        });
});
module.exports = router;
