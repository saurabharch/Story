const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Subscription = mongoose.model('push_subscriber');


router.delete(('/') , (req, res) => {
    //const subscriptionModel = new Subscription(req.body);
    console.log(req);
    Subscription.remove({
            endpoint: subscription.endpoint,
            keys: {
                        p256dh: subscription.keys.p256dh,
                        auth: subscription.keys.auth
                  }
    }).then(() => {
        res.json({
            status:true,
            data:'Successfully Unsubcribe.'
        })
    })
    .catch ((err) => {
            reject({
                status: false,
                endpoint: subscription.endpoint,
                data: err
            });
        })
});
module.exports = router;