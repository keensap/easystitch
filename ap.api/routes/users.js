var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var item = require('../models/user.js');

/* GET /users listing. */
router.get('/', function (req, res, next) {
    //Query String variables
    var search = req.query.q;
    var orderBy = req.query.o;
    var pageNumber = req.query.p;
    var pageSize = req.query.s;
    
    //Local Variables
    var orderByDescending = false;
    var recordCount = -1;

    //Query
    var query = item.find();
    
    //Search
    if (search != null) {
        query.where({ name: new RegExp('^' + search, "i") });
    }
    //Get Count
    query.count(countCallback);
    
    
    //Count Callback
    function countCallback(err, count) {
        if (err) return next(err);
        recordCount = count;
        //reinitate
        query.find();
        //order by
        if (orderBy != null) {
            query.sort(orderBy);
        }
        //skip
        if (pageNumber != null && pageNumber > 0) {
            query.skip((pageNumber - 1) * pageSize);
        }
        //limit
        if (pageSize != null) {
            query.limit(pageSize);
        }
        //Get Data
        query.exec(dataCallback);
    }
    
    //Data Callback
    function dataCallback(err, items){
        if (err) res.json(err);
        res.json({ data: items, total_count: recordCount, page_number: pageNumber } );
    }    
});


/* GET /users/id */
router.get('/:id', function (req, res, next) {
    item.findById(req.params.id, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
/* POST /users */
router.post('/', function (req, res, next) {
    //item.generateSalt(req.body)
    item.create(req.body, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
/* PUT /users/:id */
router.put('/:id', function (req, res, next) {
    item.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
/* DELETE /users/:id */
router.delete('/:id', function (req, res, next) {
    item.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) res.json(err);
        res.json(post);
    });
});
module.exports = router;