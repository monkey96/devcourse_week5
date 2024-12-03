const express = require('express');
const app = express();
app.listen(5500);
app.use(express.json())

let db = new Map();


app.route('/channels')
.get(function(req, res) { // total channel view 
    if(db.size > 0) {
        var channels = {};

        db.forEach(function (value , key) {
            channels[key] = value;
        });

        res.status(200).json(channels);
    }
    else {
        res.status(404).json({
            message : "DB is empty."
        })
    }
    
    
})
.post(function(req, res) { // create a channel
    const {channelTitle} = req.body;
    if (channelTitle) {
        let channel = {
            title : channelTitle,
            subscriber : 0,
            videoNum : 0
        }
        if (db.has(channelTitle)) {
            res.status(401).json({
                message: "Channel title already used"
            })
        }
        else {
            db.set(channelTitle, channel);
            res.status(201).json({
                message: `${channelTitle} channel has been created`
            })
        }
    }
    else {
        res.status(400).json({
            message: `Check the request form, unable to process it`
        })
    }
    
})

app.route('/channels/:id')
.get(function(req, res) { // select channel view 
    const {id} = req.params;
    
    if (db.get(id) == undefined) {
        res.status(404).json({
            message: "cannot find requested data"
        })
    } else {
        res.status(200).json(
            db.get(id)
        )
    }
})
.put(function(req, res) { // select channel change 
    const {id} = req.params;
    const {channelTitle} = req.body;

    let channel = db.get(id);
    

    if (channel == undefined) {
        res.status(404).json({
            message: "cannot find requested data"
        })
    } else {
        channel.title = channelTitle;
        if (db.has(channelTitle)) {
            res.status(401).json({
                message: `${channelTitle} is already in use`
            });
        }
        else {
            db.set(channelTitle, channel);
            db.delete(id);
            res.status(201).json({
                message: `${id} channel has been changed to ${channelTitle}`
            })
        }
    }
})
.delete(function(req, res) { // select channel delete
    const {id} = req.params;
    
    if (db.get(id) == undefined) {
        res.status(404).json({
            message: "cannot find requested data"
        })
    } else {
        db.delete(id);
        res.status(200).json({
            message: `${id} channel has been deleted`
        });
    }
})