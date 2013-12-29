var email = require('../email.js');

var ephemeral = {
  "content": "hello there, this is the message.",
  "recipient": "chanbessie@gmail.com",
  "send_date": "12/12/12",
  "create_date": "12/12/13",
  "_id": "jfkalsjfdks"
}

email.sendMail(ephemeral);

