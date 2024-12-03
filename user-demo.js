// express module setting
const express = require('express');
const app = express();
app.listen(5500);
app.use(express.json())

let db = new Map();

app.post('/login', function(req, res) {
    const {id, pwd} = req.body;
    let user = db.get(id);
    if (user){
        if (user.pwd == pwd) {
            res.status(200).json({
                message: `Welcome User ${user.name}`
            });
        }
        else {
            res.status(401).json({
                message: `Cannot login with submitted id / pwd`
            })
        }
    }
    else {
        res.status(401).json({
            message: `Cannot login with submitted id / pwd`
        });
    }
});

app.post('/join', function(req, res) {
    const {id, pwd, name} = req.body;

    if (id != undefined && pwd != undefined && name != undefined) {
        db.set(id, req.body);
        res.status(201).json({
            message: `Welcome User ${name}`
        });
    }
    else {
        res.status(400).json({
            message: `Unable to process your request`
        });
    }
});

app.get('/users/:id', function(req, res) {
    let {id} = req.params;
    const user = db.get(id);
    if (user) {
        res.status(200).json({
            userId : user.id,
            name : user.name
        });
    } else {
        res.status(404).json({
            message: `Unable to find user with id ${id}`
        })
    }

});

app.delete('/users/:id', function(req, res) {
    let {id} = req.params;
    const user = db.get(id);
    if (user) {
        res.status(200).json({
            message: `Successfully removed user id ${user.id}`
        });
        db.delete(id);
    } else {
        res.status(404).json({
            message: `Unable to find user with id ${id}`
        })
    }
});
