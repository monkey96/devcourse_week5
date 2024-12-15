const express = require('express');
const router = express.Router();
const connection = require('../mariadb')
const {body, param, validationResult} = require('express-validator');

router.use(express.json())

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) {
        return next();
    }
    else {
        return res.status(400).json(err.array());
    }
}

router.route('/')
.get(
    [
        body('userId').notEmpty().isInt().withMessage('need integer'),
        validate
    ],
    function(req, res, next) { // total channel view 

        var {userId} = req.body;
        let sql = `SELECT * FROM Channels WHERE user_id = ?`
        connection.query(sql, userId, 
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                if (results.length) {
                    res.status(200).json(results);
                }
                else {
                    res.status(400).end();
                }
            }
        );
})
.post(
    [
        body('userId').notEmpty().isInt().withMessage('put numbers!'),
        body('name').notEmpty().isString().withMessage('put strings!'),
        validate
    ],
    function(req, res, next) { // create a channel
        const {name, userId} = req.body;
        
        let sql = `INSERT INTO Channels (name, user_id) VALUES (?, ?)`;
        let values = [name, userId];
        connection.query(sql, values,
            function(err, results) {
                if (err) {
                    console.log(err);
                    return res.status(400).end();
                }
                res.status(201).json(results);
            }
        );
    }
);

router.route('/:id')
.get(
    [
        param('id').notEmpty().withMessage('need channel id'),
        validate
    ],
    function(req, res, next) { // select channel view 
        let {id} = req.params;
        id = parseInt(id);

        let sql = `SELECT * FROM Channels WHERE id = ?`
        connection.query(sql, id,
            function(err, results) {
                if (err) {
                    console.log(err)
                    return res.status(400).end();
                }
                if(results.length){
                    res.status(200).json(results);
                }
                else {
                    res.status(404).json({
                        message: "cannot find requested data"
                    })
                }
            }
        )
    }
)
.put(
    [
        param('id').notEmpty().withMessage('need channel id'),
        body('channelTitle').notEmpty().isString().withMessage("Title must be string"),
        validate
    ],
    function(req, res) { // select channel change 
        let {id} = req.params;
        id = parseInt(id);

        const {channelTitle} = req.body;
        
        let sql = `UPDATE Channels SET name=? WHERE id=?`
        let values = [channelTitle, id]
    
        connection.query(sql, values,
            function(err, results) {
                if(err) {
                    return res.status(400).end();
                }
                if (results.affectedRows == 0) {
                    return res.status(400).end();
                } else {
                    res.status(200).json(results);
                }
            }
        );
    }
)
.delete(
    [
        param('id').notEmpty().withMessage('need channel id'),
        validate
    ],
    function(req, res) { // select channel delete

        let {id} = req.params;
        id = parseInt(id);
        
        let sql = `DELETE FROM Channels WHERE id = ?`
        connection.query(sql, id, 
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                if (results.affectedRows == 0) {
                    return res.status(400).end();
                } else {
                    res.status(200).json(results);
                }
            }
        );
    }
)

module.exports = router;