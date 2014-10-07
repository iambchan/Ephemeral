var nodemailer = require('nodemailer');
var jade = require('jade');

// configure email
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PW
    }
});

exports.sendMail = function(ephemeralDB, models, ephemeral) {
    //var link = "http://ephemeral-messages.herokuapp.com/" + ephemeral._id;
    console.log("in sendMail Method");

    // set the link to ephemeral depending on environment (test or prod)
    var environmentLink;
    if (process.env.PORT) {
        environmentLink = "http://ephemeral-messages.herokuapp.com/";
    } else {
        environmentLink = "http://localhost:3000/";
    }
    var link = environmentLink + ephemeral._id;
    var options = {
        link: link
    };
    var jade_html = jade.renderFile(__dirname + '/views/email.jade', options);

    var mailOptions = {
        from: "No Reply ✔ <noreply@ephemeral.com>", // sender address
        to: ephemeral.recipient, // list of receivers
        subject: "Ephemeral message", // Subject line
        html: jade_html // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) console.log(error);
        else {
            console.log("Message sent: " + response.message);
            //update email_sent flag in the database so we don't send it again.
            ephemeralDB.updateEmailSentFlag(models, ephemeral);
        }
    });

};