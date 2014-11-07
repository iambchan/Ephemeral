// I'm a front server!

var app = require('express')(),
    httpProxy = require('http-proxy');

var proxy = new httpProxy.createProxyServer();

// We will dispatch based on the host
app.use(function(req,res) {
	if(req.header('host') == 'ephemeral.dev') {
        console.log('Proxying request to localhost:3000');
        
        // Uncomment me to forward a request
        // proxy.web(req, res, {target: 'localhost:3000'})
	} else if (req.header('host') == 'ephemeral.test') {
        console.log('Proxying request to localhost:3001');
        
        // Uncomment me to forward a request
        // proxy.web(req, res, {target: 'localhost:3001'})
	} else {
		res.send(404, 'Host not found!')
	}
});


app.listen(80);
console.log('Frontend server listening on port 80.');