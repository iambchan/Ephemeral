function ReadEphemeral(db, itemId, onSuccess, onFailure) {
    db.Ephemeral.findById(itemId, function(err, ephemeral) {
        if (err) { onFailure(err); }
        else { 
            RemoveEphemeral(db, ephemeral, onSuccess, onFailure); 
        }
    });
}

// Gets the ephemeral given the itemId and returns the found ephemeral
function GetEphemeral(db, itemId, onSuccess, onFailure) {
    db.Ephemeral.findById(itemId, function(err, ephemeral) {
        if (err) { onFailure(err); } 
        else { onSuccess(ephemeral); }
    });
}

function FindAndRemoveEphemeral(db, ephemeralId, onSuccess) {
    db.Ephemeral.findByIdAndRemove(
        { "_id": ephemeralId }, 
        function(ephemeral) { onSuccess(ephemeral); }
    );
}

function UpdateEmailSentFlag(db, ephemeral, onSuccess) {
    ephemeral.email_sent = "true";
    ephemeral.save(
        function(err, results) {
            if (err) {
                console.log("error updating email sent flag");
                console.log(err);
            } else if (!!onSuccess) {
                onSuccess(results);
            }
    });
}

// Gets number of future ephemerals (notification email not sent yet)
function GetNumUnsentEphemerals(db, onSuccess, onFailure) {
    db.Ephemeral.find(
        { "email_sent": false }, 
        function(err, ephemerals) {
            if (err) { onFailure(err); } 
            else { onSuccess(ephemerals.length); }
        }
    );
}

// Get number of ephemerals waiting to be read
function GetNumSentEphemerals(db, onSuccess, onFailure) {
    db.Ephemeral.find({ "email_sent": true }, 
        function(err, ephemerals) {
            if (err) { onFailure(err); } 
            else { onSuccess(ephemerals.length); }
        }
    );
}

// Query for ephemerals with overdue or due send dates
function GetEphemeralsDueForSending(db, onSuccess, onFailure) {
    db.Ephemeral.find(
        { send_date: { $lte: new Date() } }, 
        function(err, results) {
            if (err) { onFailure(err); } 
            else { 
                onSuccess(results);
                console.log("found " + results.length + " ephemerals");
            }
        }
    );
}

// increments totalMessages count but doesn't return the updated count object
function UpdateCounts(db, onSuccess, onFailure) {
    db.Globals.update(
        { name: "totalMessages" },
        { $inc: { value: 1} },
        function(err, count, results) {
            if(err) { onFailure(err); } 
            else { onSuccess(results); }
        }
    );
}

// Returns the actual object with updated totalMessages count.
function UpdateCountsWithUpdatedValue(db, onSuccess, onFailure) {
    var query = { name: 'totalMessages' };
    var update = { $inc:{value:1} };
    var options = {};
    db.Globals.findOneAndUpdate(query, update, options, 
        function (err, results) {
            if (err) { onFailure(err); }
            else { onSuccess(results); }
        }
    );
}

// Gets the total messages sent
function GetTotalMessageCount(db, onSuccess, onFailure) {
    db.Globals.find({name: "totalMessages"}, function(err, results){
        if(err) { onFailure(err); } 
        else { onSuccess(results); }
    });
}

// Defining the schema
exports.init = function(mongoose) {
    var ephemeralSchema = mongoose.Schema({
        message_id: String,
        recipient: String,
        content: String,
        from_user: String,
        send_date: {
            type: Date
        },
        create_date: {
            type: Date,
            default: Date.now()
        },
        email_sent: {
            type: Boolean,
            default: false
        }
    });

    // Collection of global counts 
    var globalsSchema = mongoose.Schema({
        name: String,
        value: Number,
    });

    return {
        Ephemeral: mongoose.model('Ephemeral', ephemeralSchema),
        Globals: mongoose.model('Globals', globalsSchema)
    };
};

// Exports
exports.getTotalMessageCount = GetTotalMessageCount;
exports.updateCounts = UpdateCountsWithUpdatedValue;
exports.readEphemeral = ReadEphemeral;
exports.getEphemeral = GetEphemeral;
exports.updateEmailSentFlag = UpdateEmailSentFlag;
exports.getNumSentEphemerals = GetNumSentEphemerals;
exports.getNumUnsentEphemerals = GetNumUnsentEphemerals;
exports.getEphemeralsDueForSending = GetEphemeralsDueForSending;
exports.findAndRemoveEphemeral = FindAndRemoveEphemeral;