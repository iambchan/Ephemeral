# Ephemeral

> Ephemeral: 
> _adjective_
> 1. lasting for a very short time.

We often take our emails and text messages for granted as we can revisit them as often as we like in our chat logs and email inbox. Nowadays a lot of our history is stored in the cloud or our devices.

This web app was created so that we can create something that's _temporary_, something that won't be stored in our chat logs forever. The purpose of this app is to bring us to the realization that we should really **cherish the little things** that happen in life not stored in your phone or email inbox. 

This app was made for the purpose of creating __messages that lasts for a short time__. The idea is to be able to create a message for anyone you want at a specified date. The user will be emailed a link to the message on the specified ate. Once the user clicks on the link they will be redirected to the ephemeral and it will be deleted from the database forever. What if you want to read the message again? It can't be done. __Did you really stop to appreciate what you just read?__ Nowadays, we skim content too quickly, more often than we think we think but we don't realize how precious some things are until they're gone. Some of the best things in life lasts only for a short momemnt in time. 

Access the heroku hosted app [here](http://ephemeral-messages.herokuapp.com).

# Technical

Ephemeral is a node web application that uses the following:

- [Expressjs](https://github.com/strongloop/express)
- [Jade](https://github.com/jadejs/jade)
- [Mongodb](http://www.mongodb.org/)
- [node-schedule](https://github.com/mattpat/node-schedule)
- [nodemailer](https://github.com/andris9/Nodemailer)
- [q](https://github.com/kriskowal/q)
- bootstrap
- jQuery

The purpose of this application is an introduction to learn web development using the nodejs framework.
This application began in 2013 December with @rymndhng and completed by me this fall of October 2014. 

# Deployment instructions
Start the application locally by using the command
```bash
node app.js
```

## Connecting to mongo db locally
```bash
sudo mongod
```

###Run mongo queries
```bash
☁  ~  mongo
MongoDB shell version: 2.6.4
connecting to: test
> use test
switched to db test
> db.ephemerals.find()
```

 
