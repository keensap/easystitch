var mongoose = require('mongoose');
    express = require('express'),
    bodyParser = require('body-parser')
var app = express();

//To begin, we will need a schema and a model in order to work with the data that will be persisted in our 
//MongoDB database.Schemas define the structure of documents within a collection and models are used to 
//create instances of data that will be stored in documents.We will be making a database of items to keep 
//track of which movies have credit cookies(post - credit scenes).Let 's start off by creating a Movie schema and model.
var itemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    html: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: true },
    updated_at: { type: Date, default: Date.now },
    update_by: String,
    __v: { type: Number, select: false }//hide version 

});

itemSchema.pre('save', function (next) {
    this.increment(); //version increment 
    next();
});

// Compile a 'Item' model using the movieSchema as the structure.
// Mongoose also creates a MongoDB collection called 'Items' for these documents.
var itemModel = mongoose.model('Page', itemSchema);

module.exports = itemModel;
