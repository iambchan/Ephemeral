function ReadEphemeral(db, itemId, onSuccess, onFailure) {
    db.Ephemeral.findById(itemId, function (err, ephemeral) {
        if(err) {
            onFailure(err);
        } else {
           RemoveEphemeral(db, ephemeral, onSuccess, onFailure);
        }
    });
}

// Gets the ephemeral given the itemId and returns the found ephemeral
function GetEphemeral(db, itemId, onSuccess, onFailure) {
    db.Ephemeral.findById(itemId, function (err, ephemeral) {
        if(err) {
            onFailure(err);
        } else {
            onSuccess(ephemeral);
        }
    });
}

// removes ephemeral, parameter - ephemeral
function RemoveEphemeral(db, ephemeral) {
    console.log(ephemeral);
    db.Ephemeral.remove({"_id": ephemeral._id}, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log("successfully removed ephemeral");
        }
    });
}

function UpdateEmailSentFlag(db, ephemeral) {
    console.log(ephemeral);
    ephemeral.email_sent = "true";
    ephemeral.save(function (err, new_message) {
    if (err) {
        console.log("error updating email sent flag");
        console.log(err);
    }
  });
}

exports.init = function(mongoose) {

    var ephemeralSchema = mongoose.Schema({
        message_id: String,
        recipient: String,
        content: String,
        from_user: String,
        send_date: { type: Date },
        create_date: { type: Date, default: Date.now() },
        email_sent: { type: Boolean, default: false }
    });

    return {
        Ephemeral: mongoose.model('Ephemeral', ephemeralSchema),
        // readEphemeral: ReadEphemeral.bind(null, mongoose)
    };
}

// reads ephemeral and removes it
exports.readEphemeral = ReadEphemeral;
exports.getEphemeral = GetEphemeral;
exports.removeEphemeral = RemoveEphemeral;
exports.updateEmailSentFlag = UpdateEmailSentFlag;