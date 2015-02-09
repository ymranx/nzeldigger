var nzelDigger = require('./nzeldigger'),
	nzelstore  = require('./nzelstore');

var access_token = 'your-angel-list-token';
var nzel 	     = new nzelDigger(access_token);
var nzelStore    = new nzelstore('mysql-host', 'username', 'password');
var storeHandler = nzelStore.connect();
var access_token = 'Your angel list access token';
var nzel = new nzelDigger(access_token);

nzel.on('ready', function() {
	storeHandler(function(err){
		if(err) {
			console.error(err);
			return;
		}
		console.log('Connected');
		var jobs = nzel.getJobs();
		for(var job of jobs()) {
		    job(jobHandler);
    	}
	});   
});

nzel.on('error', function(error) {
    console.log(error);
});

var jobHandler = function jobHandler(error, response, body) {
	if(error) {
		console.log(error);
		return;
	}
	setTimeout(function(){
		nzelStore.save(body);
	}, 50);
	console.log(helper.getBasicProperties(JSON.parse(body)));
}
