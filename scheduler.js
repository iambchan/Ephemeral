var email = require('./email.js');
var schedule = require("node-schedule");

exports.init = function(ephemeraldb, models) {
    var rule = new schedule.RecurrenceRule();

    function onSuccess(ephemerals) {
        console.log("found " + ephemerals.length + " ephemerals");
        ephemerals.forEach(function(ephemeral) {
            //do not send a notification email if it was already sent.
            if (ephemeral.email_sent) {
                return;
            }
            email.sendMail(ephemeraldb, models, ephemeral);
        });
    }

    function onFailure(err) {
        console.log(err);
    }
    var j = schedule.scheduleJob(rule, function() {
        console.log("running email scheduler");
        ephemeraldb.getEphemeralsDueForSending(models, onSuccess, onFailure);
    });
};