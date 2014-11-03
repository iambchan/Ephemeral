var nodemailer = require('nodemailer');
var jade = require('jade');

// Configure email
// Create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PW
    }
});

// Sends email given ephemeral and configured properties
// updateEmailSent - bool indicating whether you want update the sent flag in the database
exports.sendMail = function(ephemeralDB, models, ephemeral, updateEmailSent) {
    console.log("In sendMail method");
    var ephemeralLink = getEphemeralLink(ephemeral);
    var options = {
        link: ephemeralLink
    };
    var jade_html = jade.renderFile(__dirname + '/views/email.jade', options);
    var mailOptions = getMailOptions("No Reply ✔ <noreply@ephemeral.com>", ephemeral.recipient, "Ephemeral Messages", jade_html);

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) console.log(error);
        else {
            console.log("Message sent: " + response.message);
            if (updateEmailSent) {
                //update email_sent flag in the database so we don't send it again.
                ephemeralDB.updateEmailSentFlag(models, ephemeral);
            }
        }
    });

};

// set the link to ephemeral depending on environment (test or prod)
function getEphemeralLink(ephemeral) {
    var environmentLink;
    if (process.env.PORT) {
        environmentLink = "http://ephemeral-messages.herokuapp.com/";
    } else {
        environmentLink = "http://localhost:3000/";
    }
    return environmentLink + ephemeral._id;
}

// Returns mailoptions object for smtpTransport.sendMail method
function getMailOptions(from, to, subject, html) {
    return {
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html // html body
    };
}