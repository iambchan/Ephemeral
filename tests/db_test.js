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
db.once('open', function callback () {
  // yay!
});

var echan = require('../models')
var models = echan.init(mongoose)

// create ephemeral
var message = {
	"content": "test messsage",
	"recipient": "chanbessie@gmail.com",
	"send_date": new Date(),
	"from_user": "test"
};

var new_message = new models.Ephemeral(message);

new_message.save(function (err, new_message) {
	console.log("Saved new message");
	echan.updateEmailSentFlag(models, new_message);
	//echan.readEphemeral(models, new_message._id, onSuccess, onFailure);
});

function onSuccess() {
  	// check if the ephemeral was deleted
  	console.log("ephemeral deleted");
  	return true;
}

function onFailure(err) {
  	console.log("failed to read and delete ephemeral")
  	console.log(err);
  	return false;
}









