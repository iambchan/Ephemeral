var email = require('../email.js');

var ephemeral = {
  "content": "hello there, this is the message.",
  "recipient": "chanbessie@gmail.com",
  "send_date": "12/12/12",
  "create_date": "12/12/13",
  "message_id": "jfkalsjfdks"
};
// Link in the email sent will be undefined since we're not actually creating
// an ephemeral from the schema
email.sendMail(null, null, ephemeral, false);

