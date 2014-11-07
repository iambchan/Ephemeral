/*******************************************************************************

Demo Proxy Server.

A proxy server acts as a middleman between your web requests. Typically, you use
a /real/ web server like nginx or apache to do this. For demonstration, here is
a small node server that proxies requests.

Diagram:
                                            
[Person On the Internet]  <---> [Proxy] <--> [Internal Applications]


Setup
-----

Ensure the following entries are in your `/etc/hosts` file:

127.0.0.1     ephemeral.dev
127.0.0.1     ephemeral.tes


Run three terminals.

    In terminal 0:  > mongod
    In terminal 1:  > env PORT=3000 node app.js
    In terminal 2:  > env PORT=3001 node app.js

Finally, start the front server:

    > node front.js

*******************************************************************************/
var express   = require('express'),
    httpProxy = require('http-proxy');

// Create some resources
var app = express();
var proxy = new httpProxy.createProxyServer();

/*******************************************************************************
 Our app consists of a single middleware. It performs proxying by inspecting
some feature of a request. Here, we are checking the Host header of a request.
You can dispatch based on practially anything if desired.


In your web browser, open the Inspector, then visit the url http://ephemeral.dev

The headers will start with the following lines:

    GET / HTTP/1.1
    Host: ephemeral.dev

Notice that Remote Address is 127.0.0.1:80


Now, make a request to http//ephemeral.test.

The first two headers should look like this:

    GET / HTTP/1.1
    Host: ephemeral.test

Note the Remote Address is *the same*.

This means that when you make a web request: the Remote Address & the Host are totally decoupled from each other. This is very useful because it lets me run multiple applications on the same server.

I can host: blog.rymndhng.com, busfumes.rymndhng.com, loameo.com all on the same computer with different `HOST` headers, so long as in the end Remote Address is the same!

*/
app.use(function(req,res) {
    
	if(req.header('host') == 'ephemeral.dev') {
        console.log('Proxying request to localhost:3000');
        
        // Uncomment me to forward a web request, comment out the other line
        // proxy.web(req, res, {target: 'localhost:3000'})
        res.send(200)
	} else if (req.header('host') == 'ephemeral.test') {
        console.log('Proxying request to localhost:3001');
        
        // Uncomment me to forward a web request, comment out the line below
        // proxy.web(req, res, {target: 'localhost:3001'})
        res.send(200)
	} else {
        // We didn't find a match, it's a good idea to send 404
		res.send(404, 'Host not found!')
	}
});

// Run the port on 80!
app.listen(80);
console.log('Frontend server listening on port 80.');