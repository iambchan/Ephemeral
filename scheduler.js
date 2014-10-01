var email = require('./email.js');
var schedule = require("node-schedule");


exports.init = function(models) {
  var rule = new schedule.RecurrenceRule();
  
  var j = schedule.scheduleJob(rule, function(){
    console.log("running email scheduler");
    models.Ephemeral.find({send_date: {$lte: new Date()}}, function(err, results){
      console.log("found " + results.length + " ephemerals");
      results.forEach(function(ephemeral){
      	email.sendMail(ephemeral);
      });
  	});
  });
}