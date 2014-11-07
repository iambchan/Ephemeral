// I'm a front server!

var app = require('express')(),
var httpProxy = require('http-proxy');

var proxy = new httpProxy.RoutingProxy();

// We will dispatch based on the host
app.use(function(req,res) {
	if(req.header('host') == 'ephemeral.dev') {
		proxy.proxyRequest(req, res, {host: 'localhost', port: 3000})
	} else if (req.header('host') == 'ephemeral.test') {
		proxy.proxyRequest(req, res, {host: 'localhost', port: 3001})
	} else {
		res.send(404, 'Host not found!')
	}
});


app.listen(80);
console.log('Frontend server listening on port 80.');
var express = require('express');