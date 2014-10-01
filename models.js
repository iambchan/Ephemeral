function ReadEphemeral(db, itemId, onSuccess, onFailure) {
    db.Ephemeral.findById(itemId, function (err, ephemeral) {
        if(err) {
            onFailure(err);
        } else {
            onSuccess(ephemeral);
            db.Ephemeral.remove({"_id": ephemeral._id}); 
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
        create_date: { type: Date, default: Date.now() }
    });

    return {
        Ephemeral: mongoose.model('Ephemeral', ephemeralSchema),
        // readEphemeral: ReadEphemeral.bind(null, mongoose)
    };
}

// reads ephemeral and removes it
exports.readEphemeral = ReadEphemeral;