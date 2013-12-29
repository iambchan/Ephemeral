exports.init = function(mongoose) {

    var ephemeralSchema = mongoose.Schema({
        message_id: String,
        recipient: String,
        content: String,
        send_date: { type: Date },
        create_date: { type: Date, default: Date.now() }
    });

    return {
        Ephemeral: mongoose.model('Ephemeral', ephemeralSchema)
    };
}
