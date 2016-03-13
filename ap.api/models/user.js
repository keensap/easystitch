var mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require('body-parser'),
    bcrypt = require('bcrypt'),
    jwt = require('express-jwt');
var app = express();

//Schema of Supplier 
var userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: String,
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: true },
    updated_at: { type: Date, default: Date.now },
    update_by: String,
    __v: { type: Number, select: false }//hide version 

});

// Bcrypt middle-ware on UserSchema
userSchema.pre('save', function (next) {
    this.increment(); //version increment 
    var user = this;
    
    if (!user.isModified('password')) return next();
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        user.salt = salt;
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

    //next();
});   

//Password verification
userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

//Validations
userSchema.path('password').validate(function (value) {
    return value.length <= 20 && value.length >= 6;
}, 'Length of Password  must be between 6 to 15 characters');
userSchema.path('email').validate(function (value) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value);
}, 'Invalid email');

// Compile a 'User' model using the userSchema as the structure.
var userModel = mongoose.model('User', userSchema);

module.exports = userModel;

////method to authenticate an user and create the Token
//module.exports.login = function (req, res) {
//    var username = req.body.username || '';
//    var password = req.body.password || '';
    
//    if (username == '' || password == '') {
//        return res.send(401);
//    }
    
//    db.userModel.findOne({ username: username }, function (err, user) {
//        if (err) {
//            console.log(err);
//            return res.send(401);
//        }
//        if (user != null) {
//            if (user.salt != null && user.salt != "") {
//                user.comparePassword(password, function (isMatch) {
//                    if (!isMatch) {
//                        console.log("Attempt failed to login with " + user.username);
//                        return res.send(401);
//                    }
                    
//                    var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
                    
//                    return res.json({ token: token });
//                });
//            } else {
//                if(user.password!=password) {
//                    console.log("Attempt failed to login with " + user.username);
//                    return res.send(401);
//                }
                
//                var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
                
//                return res.json({ token: token });
//            }
//        } else {
//            return res.send(401);
//        }
//    });
//};
