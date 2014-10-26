// Create the model
// CAll the function
// verify ephemeral is deleted
var mongoose = require('mongoose');
//configure dependencies
var MONGO_URL = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/test';

var PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // yay!
});

var echan = require('../models');
var models = echan.init(mongoose);

// create ephemeral
var message = {
    "content": "test messsage",
    "recipient": "chanbessie@gmail.com",
    "send_date": new Date(),
    "from_user": "test"
};

var new_message = new models.Ephemeral(message);

new_message.save(function(err, new_message) {
    console.log("Saved new message");
    testNumDueEphemerals();
    //testGetNumSentEphemerals();
    //echan.updateEmailSentFlag(models, new_message);
});

function onSuccess(message) {
    console.log(message);
}

function onFailure(err) {
    console.log("test failed");
    console.log(err);
}

//TODO:
//1. verify ephemeral exists in db after saving
//2. verify email sent flag is true after email is sent

function testGetNumUnsentEphemerals() {
    echan.getNumUnsentEphemerals(models, function(numEphemerals) {
        if (numEphemerals === 1) {
            console.log("number of ephemerals: " + numEphemerals);
            console.log("testGetNumUnSentEphemerals pass");
        } else {
            console.log("expected 1 unsent ephemeral but actual: " + numEphemerals);
        }
    });
}

// Tests here
function testNumDueEphemerals() {
    echan.getEphemeralsDueForSending(models, function(ephemerals) {
        if (ephemerals.length == 1) {
            console.log(ephemerals.length);
            console.log("test get number of due ephemerals pass");
        } else {
            console.log("expected 1 due ephemeral but actual: " + ephemerals.length);
        }
    }, function(err) {
        console.log(err);
    });
}