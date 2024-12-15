const express = require('express');
const router = express.Router();
const connection = require('../mariadb');
const {body, param, validationResult} = require('express-validator');

// jwt
const jwt = require('jsonwebtoken');
//dotenv
const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) {
        return next();
    }
    else {
        return res.status(400).json(err.array());
    }
};

router.post('/login', 
    [
        body('email').notEmpty().isEmail().withMessage('need email string'),
        body('pwd').notEmpty().isString().withMessage('need password'),
        validate
    ],
    function(req, res) {
        const {email, pwd} = req.body;

        let sql = `SELECT * FROM users WHERE email = ?`;
        connection.query(sql, email, 
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                var loginUser = results[0];
                if (loginUser && loginUser.password == pwd) {
                    const token = jwt.sign({
                        email : loginUser.email,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY, {
                        expiresIn : '5m',
                        issuer: "monkey"
                    });

                    res.cookie("token", token, {
                        httpOnly: true
                    });

                    res.status(200).json({
                        message : `${loginUser.name}, welcome!`
                    });
                }
                else {
                    res.status(403).json({
                        message: `Cannot login with submitted credentials`
                    });
                }
            }
        );
    }
);

router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('need email string'),
        body('name').notEmpty().isString().withMessage('need name string'),
        body('pwd').notEmpty().isString().withMessage('need password'),
        body('contact').notEmpty().isString().withMessage('need contact'),
        validate
    ],
    function(req, res) {
        const {email, name, pwd, contact} = req.body;
        let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`;
        let values = [email, name, pwd, contact]
        connection.query(sql, values,
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                res.status(201).json(results);
            }
        );
    }
);

router.route('/users')
.get(
    [
        body('email').notEmpty().isEmail().withMessage('need email string'),
        validate
    ],
    function(req, res) {
        let {email} = req.body;
        let sql = `SELECT * FROM users WHERE email = ?`
        connection.query(sql, email, 
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                if (results.affectedRows == 0) {
                    return res.status(400).end();
                }
                else {
                    res.status(201).json(results);
                }
            }
        )
    }
)
.delete(
    [
        body('email').notEmpty().isEmail().withMessage('need email string'),
        validate
    ],
    function(req, res) {
        let {email} = req.body;
        let sql = `DELETE FROM users WHERE email = ?`
        connection.query(sql, email, 
            function (err, results) {
                if (err) {
                    return res.status(400).end();
                }
                if (results.affectedRows == 0) {
                    return res.status(400).end();
                }
                else {
                    res.status(201).json(results);
                }
            }
        )
    })

module.exports = router;