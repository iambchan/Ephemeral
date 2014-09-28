var nodemailer = require('nodemailer');
var jade = require('jade')

// configure email
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PW
    }
});

exports.sendMail = function(ephemeral) {  
  var link = "http://ephemeral-messages.herokuapp.com/" + ephemeral._id;
  var options = { link: link };
  var jade_html = jade.renderFile(__dirname + '/views/email.jade', options);
  
  var mailOptions = {
    from: "No Reply ✔ <noreply@ephemeral.com>", // sender address
    to: ephemeral.recipient, // list of receivers
    subject: "Ephemeral message", // Subject line
    html: jade_html // html body
  }
  
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error) console.log(error);
    else console.log("Message sent: " + response.message);
  
  });
   
};


