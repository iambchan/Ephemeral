var email = require('./email.js');
var schedule = require("node-schedule");

exports.init = function(ephemeraldb, models) {
    var rule = new schedule.RecurrenceRule();

    var j = schedule.scheduleJob(rule, function() {
        console.log("running email scheduler");

        models.Ephemeral.find({
            send_date: {
                $lte: new Date()
            }
        }, function(err, results) {
            console.log("found " + results.length + " ephemerals");
            results.forEach(function(ephemeral) {
                //do not send a notification email if it was already sent.
                if (ephemeral.email_sent) {
                    return;
                }
                email.sendMail(ephemeraldb, models, ephemeral);
            });
        });
    });
};