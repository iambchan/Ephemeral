var express = require('express');
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

var ephemeralDB = require('./models')
var models = ephemeralDB.init(mongoose)
require('./scheduler').init(ephemeralDB, models);

// Configure express.js
var app = express();

app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index')
});

app.post('/message', function(req, res){
  console.log(req.params);

  var message = {
      "content": req.body.content,
      "recipient": req.body.recipient,
      "send_date": req.body.send_date,
      "from_user": req.body.from_user 
    };

  var new_message = new models.Ephemeral(message);
  new_message.save(function (err, new_message) {
  if (err) // TODO handle the error
    console.log("error saving message to db");
  });
  res.redirect('/success');
});

app.get('/success', function(req, res){
  res.render('success');
});
 
app.get('/:message_id', function(req, res){
  // get message from server/database
  var id = req.params.message_id;

  function onSuccess(ephemeral) {
    if(!ephemeral) {
      res.status(404);    
    }
    res.render('ephemeral', ephemeral);

    // remove the ephemeral
    if(!!ephemeral) {
      ephemeralDB.removeEphemeral(models, ephemeral);      
    }
  }
  function onFailure(err) {
    console.log(err);
  }
  ephemeralDB.getEphemeral(models, id, onSuccess, onFailure);
});

       
app.listen(PORT);
console.log('Listening on port ' + PORT);
