var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});


var ephemeralSchema = mongoose.Schema({
    message_id: String,
    recipient: String,
    content: String,
    send_date: { type: Date },
    create_date: { type: Date, default: Date.now }
});

exports.Ephemeral = mongoose.model('Ephemeral', ephemeralSchema);

