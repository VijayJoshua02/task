var express = require('express');
var Pusher = require('pusher');

const router = express.Router()
var pusher = new Pusher({
    app_id: "1029572",
    key: "a4645a38865120f41cec",
    secret: "c7235045d339e20613e9",
    cluster: "ap2",
    encrypted: true
});

router.route('/').post((req, res, next) => {
    console.log('triggering' , req.body.option)
    pusher.trigger('poll','vote', {
        points: 10,
        option: req.body.option
    });
    res.send('Voted');
});
module.exports = router;