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

app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// adds user count to the request object
app.use(function(req, res, next) {
    var numSent = Q.defer();
    var numUnsent = Q.defer();

    ephemeralDB.getNumSentEphemerals(models, numSent.resolve);
    ephemeralDB.getNumUnsentEphemerals(models, numUnsent.resolve);

    Q.all([numSent.promise, numUnsent.promise]).then(function(counts) {
        app.locals.counts = {
            sent: counts[0],
            unsent: counts[1]
        };
        next();
    });
});

app.use('/public', express.static(__dirname + '/public'));

function onFailure(err) {
    console.log(err);
}

app.get('/', function(req, res) {
    // Get the number of sent and unsent ephemerals in the server for stats 
    res.render('index', {});
});

app.post('/message', function(req, res) {
    console.log(req.params);

    var message = {
        "content": req.body.content,
        "recipient": req.body.recipient,
        "send_date": req.body.send_date,
        "from_user": req.body.from_user
    };

    var new_message = new models.Ephemeral(message);
    new_message.save(function(err, new_message) {
        if (err) // TODO handle the error
            console.log("error saving message to db");
    });
    res.redirect('/success');
});

app.get('/success', function(req, res) {
    res.render('success');
});

app.get('/ephemeral_stats', function(req, res) {
    res.render('ephemeralStats');
});

// tracking pixel to delete when the page has loaded! 
app.get('/tracking.px', function(req, res) {
    var _id = new mongoose.Types.ObjectId(req.query.message_id);
    ephemeralDB.findAndRemoveEphemeral(models, _id, function(ephemeral) {
        console.log("Ephemeral  deleted: " + ephemeral);
    });
    res.redirect('/public/images/track.png');
});

app.get('/:message_id', function(req, res) {
    // get message from server/database
    var id = req.params.message_id;

    function onSuccess(ephemeral) {
        if (!ephemeral) {
            res.status(404);
        }
        res.render('ephemeral', ephemeral);
    }

    function onFailure(err) {
        console.log(err);
    }
    ephemeralDB.getEphemeral(models, id, onSuccess, onFailure);
});


app.listen(PORT);
console.log('Listening on port ' + PORT);