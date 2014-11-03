var email = require('./email.js');
var schedule = require("node-schedule");

// Intialize the email scheduler which checks the database and sends email every minute
exports.init = function(ephemeraldb, models) {
    // Defaults to sending email every minute
    var rule = new schedule.RecurrenceRule();

    function onSuccess(ephemerals) {
        console.log("found " + ephemerals.length + " ephemerals");
        ephemerals.forEach(function(ephemeral) {
            //do not send a notification email if it was already sent.
            if (ephemeral.email_sent) {
                return;
            }
            email.sendMail(ephemeraldb, models, ephemeral, true);
        });
    }

    function onFailure(err) {
        console.log(err);
    }
    var j = schedule.scheduleJob(rule, function() {
        console.log("Running email scheduler");
        ephemeraldb.getEphemeralsDueForSending(models, onSuccess, onFailure);
    });
};