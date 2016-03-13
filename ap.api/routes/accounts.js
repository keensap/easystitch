var express = require('express');
var jwt = require('express-jwt');
var webtoken = require('express-jwt/node_modules/jsonwebtoken');
var router = express.Router();

var mongoose = require('mongoose');
var userModel = require('../models/user.js');
var config = require('../common/config.js');



/* POST /accounts */
router.post('/', function (req, res, next) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    
    if (username === '' || password === '') {
        return res.send(401);
    }
    
    userModel.findOne({ email: username }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(401);
        }
        if (user !== null) {
            if (user.salt !== null && user.salt !== "") {
            user.comparePassword(password, function (isMatch) {
                if (!isMatch) {
                    console.log("Attempt failed to login with " + user.email);
                    return res.status(401).send({ code: 1001, message: "Attempt failed to login with " + user.email });
                }
                
                var token = webtoken.sign(user, config.appSetting.secretToken, { expiresIn: 60 * 60 });
                
                return res.json({ token: token });
                });
            } else {
                if (user.password !== password) {
                    console.log("Attempt failed to login with " + user.email);
                    return res.status(401).send({ code: 1001, message: "Attempt failed to login with " + user.email });
                }
                
                var token = webtoken.sign(user, config.appSetting.secretToken, { expiresIn: 60 * 60 });
                
                return res.json({ token: token });
            }
        } else {
            console.log("Invalid User-name:" + username);
            return res.status(401).send({ code: 1001, message: "Invalid User-name:" + username});
        }
 
    });
});

module.exports = router;