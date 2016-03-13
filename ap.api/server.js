var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.port || 8063;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose'),
    jwt = require('express-jwt'),
    logger = require('bunyan');

var config = require('./common/config.js');

var app = express();
app.set('port', port);
app.set('ipaddress', ipaddress);
var currentDateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

var log = new logger({
    name: 'angular-portal',
    streams: [
        {
            stream: process.stdout,
            level: 'debug'
        },
        {
            path: 'log/log.log',
            //path: 'log/log_' + currentDateStr + '.log',
            level: 'trace'
        }
    ],
    serializers: {
        req: logger.stdSerializers.req,
        res: logger.stdSerializers.req
    }
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('../app'));
// Add headers
app.use(function (req, res, next) {
    log.info({url: req.url});

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8383');
    
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE'); //, 
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, Content-Type, Accept');

  
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
});

var mongoHost = config.connectionString.mongoHost;
var mongoPort = config.connectionString.mongoPort;
var mongoDatabase = config.connectionString.mongoDatabase;
var mongoUserName = config.connectionString.mongoUserName;
var mongoPassword = config.connectionString.mongoPassword;


var connectionString = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDatabase;
//---------------------------
//For this post, we will be connecting to the test database that MongoDB defaults to when you 
//start up the shell.We 'll also make sure that any connection errors are written to the console. 
//Note the use of the open event - this is where you will create schemas and compile models.
var db = mongoose.connection;
//db.on('error', console.error);
//db.on('error', function (err) {
//    log.error({ err: err }, 'Error in connecting database');
//});
//db.once('open', function () {
//    console.log('Database connected');
//    //log.info('Database connected');
//  // Create your schema and models here.
//});
mongoose.connect(connectionString, function (err) {
    if(err){
        log.error({ err: err }, 'Error in connecting database');
    }else{
        console.log('Database connected');
    }
});


//Items
var items = require('./routes/items');
app.use('/items', items);

//Pages
var pages = require('./routes/pages');
app.use('/pages', pages);


//Users
var users = require('./routes/users');
app.use('/users', users);

//Accounts
var accounts = require('./routes/accounts');
app.use('/accounts', accounts);


app.use(function (req, res) {
    log.info({ req: req });
    res.status(404).end();
});

//var server = http.createServer(function (req, res) {
//    log.info({ req: req, res: res }, 'Got a request and a response');
//});
var server = http.createServer(app);
server.listen(app.get('port'), app.get('ipaddress'), function () {
    console.log((new Date()) + ': Express Server is listening on port ' + app.get('ipaddress') + ":" + app.get('port'));
});