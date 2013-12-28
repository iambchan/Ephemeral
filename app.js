var models = require('./models');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/public', express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index',
  { title : 'Home' }
  )
  //res.send('Template for writing a message here');
});

app.post('/message', function(req, res){
  console.log(req.params);

  var message = {
      "message_id": mongoose.Schema.Types.ObjectId,
      "content": req.body.content,
      "recipient": req.body.recipient,
      "send_date": req.body.send_date,
      "create_date": req.body.create_date
    };
  
  var new_message = new models.Ephemeral(message);  
  new_message.save(function (err, new_message) {
  if (err) // TODO handle the error
    console.log("error saving message to db");
});
  
  res.json(message);
});


app.get('/:message_id', function(req, res){
  // get message from server/database
  var message_id = req.params.message_id;
  res.send(message_id);

  // load message content
  // delete message on server
});



  

app.listen(3000);
console.log('Listening on port 3000');
