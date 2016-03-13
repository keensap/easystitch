var express = require('express');
var router = express.Router();
var webtoken = require('express-jwt/node_modules/jsonwebtoken');
var mongoose = require('mongoose');
var logger = require('bunyan');

var item = require('../models/item.js');
var common = require('../common/common.js');
var config = require('../common/config.js');

var log = new logger({
    name: 'angular-portal',
    stream: process.stdout,
    level: 'info'
});


// route middle ware to verify a token
router.use(function (req, res, next) {
    if (req.method != 'OPTIONS') {
        // check header or URL parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers["x-access-token"];
        // decode token
        if (token) {
            // verifies secret and checks exp
            webtoken.verify(token, config.appSetting.secretToken, function (err, decoded) {
                if (err) {
                    log.error({ err: err }, 'Failed to authenticate token.');
                    return res.status(403).send({ code: 1004, success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            log.error({ err: new Error('No token provided.') }, 'No token provided. ');
            return res.status(403).send({ code: 1003, success: false, message: 'No token provided.' });
        }
    } else {
        next();
    }
});

/* GET /items listing. */
router.get('/', function (req, res, next) {
    var search = req.query.q;
    var orderBy = req.query.o;
    var orderByDescending = false;
    var pageNumber = req.query.p;
    var pageSize = req.query.s;
    var query = item.find();
    var recordCount = -1;
    if (search) {
        query.where({ name: new RegExp('^' + search, "i") });
    }
    query.count(countCallback);
    
    
    
    function countCallback(err, count) {
        if (err) {
            res.json(err);
            return;
        }
        recordCount = count;
        query.find();
        if (orderBy) {
            query.sort(orderBy);
        }
        if (pageNumber && pageNumber > 0) {
            query.skip((pageNumber - 1) * pageSize);
        }
        if (recordCount > pageSize) {
            query.limit(pageSize);
        }
        try {
            query.exec(dataCallback);
        } catch (err) {
            log.error({ err: err }, 'Error in executing page list query');
            res.json(err);
        }
    }

    function dataCallback(err, items){
        if (err) {
            log.error({ err: err }, 'Error in executing page list query');
            res.json(err);
        }else {
            
            res.json({ data: items?items:null, total_count: recordCount, page_number: pageNumber?pageNumber:1 } );
        }
    }    
});

 
/* GET /items/id */
router.get('/:id', function (req, res, next) {
    item.findById(req.params.id, function (err, post) {
        if (err) {
            log.error({ err: err }, 'Error in fetching page');
            res.json(err);
        }
        res.json(post);
    });
});
/* POST /items */
router.post('/', function (req, res, next) {
    item.create(req.body, function (err, post) {
        if (err) {
            //var message = common.message(err.message, 'error', err.errors);
            res.json(err);
        }
        res.json(post);
    });
});
/* PUT /items/:id */
router.put('/:id', function (req, res, next) {
    item.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
/* DELETE /items/:id */
router.delete('/:id', function (req, res, next) {
    item.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
module.exports = router;