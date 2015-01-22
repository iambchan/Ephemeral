var express = require('express');
var mongoose = require('mongoose');
var Q = require('q');

//configure dependencies
var MONGO_URL = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test';

var PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connected to database.");
});

var ephemeralDB = require('./models');
var models = ephemeralDB.init(mongoose);
require('./scheduler').init(ephemeralDB, models);

// Configure express.js
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// adds user count to the request object
app.use(function(req, res, next) {
    var numSent = Q.defer();
    var numUnsent = Q.defer();
    var totalNumMsg = Q.defer();

    ephemeralDB.getNumSentEphemerals(models, numSent.resolve);
    ephemeralDB.getNumUnsentEphemerals(models, numUnsent.resolve);
    ephemeralDB.getTotalMessageCount(models, totalNumMsg.resolve);

    Q.all([numSent.promise, numUnsent.promise, totalNumMsg.promise]).then(function(counts) {
        app.locals.counts = {
            sent: counts[0],
            unsent: counts[1],
            totalMsg: counts[2]
        };
        next();
    });
});

app.use('/public', express.static(__dirname + '/public'));
function onFailure(err) {
    console.log(err);
}

// Main page with the form
app.get('/', function(req, res) {
    res.render('index', {});
});

// Generic onSuccess and onFailure functions
var onSuccess = function(result) {
    console.log("Success! " + result);
};

var onFailure = function(result) {
    console.log("Error! " + result);
};

app.get('/error', function(req, res) {
    res.render('error');
});

app.get('/success', function(req, res) {
    res.render('success');
});

app.get('/ephemeral_stats', function(req, res) {
    res.render('ephemeralStats');
});

// Add an Ephemeral
app.post('/message', function(req, res) {
    // Need to create new date Object based on user's current time zone
    var d = new Date(req.body.send_date);
    d.setUTCMinutes(req.body.timezone_offset);

    var message = {
        "content": req.body.content,
        "recipient": req.body.recipient,
        "send_date": d.toJSON(),
        "from_user": req.body.from_user
    };

    ephemeralDB.addEphemeral(models, message, onSuccess, onFailure); 
    res.redirect('/success');
});

// Tracking pixel to delete ephemeral when the page has loaded! 
app.get('/tracking.px', function(req, res) {
    var _id = new mongoose.Types.ObjectId(req.query.message_id);
    ephemeralDB.findAndRemoveEphemeral(models, _id, onSuccess("Ephemeral Deleted"));
    res.redirect('/public/images/track.png');
});

// Get and display message from server/database 
app.get('/:message_id', function(req, res) {
    var id = req.params.message_id;

    // Redirect user to error page if the ephemeral doesn't exist
    function onFoundSuccess(ephemeral) {
        if (!ephemeral) {
            res.status(404);
            res.redirect('/error');
        }
        res.render('ephemeral', ephemeral);
    }
    ephemeralDB.getEphemeral(models, id, onFoundSuccess, onFailure);
});

app.listen(PORT);
console.log('Listening on port ' + PORT);
