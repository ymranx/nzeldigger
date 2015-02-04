var nzelDigger = require('./nzeldigger');
	helper     = require('./nzelhelper');

var access_token = '8c02255138049f13e8a38f0ded0c047ee40a75984230a87c';
var nzel = new nzelDigger(access_token);

nzel.on('ready', function() {
    var job = nzel.getJobs();
    for(var jb of job()) {
      jb(jobHandler);
    }
});

nzel.on('error', function(error) {
    console.log(error);
});
var jobHandler = function(error, response, body) {
	if(error) {
		console.log(error);
		return;
	}
	console.log(helper.getBasicProperties(JSON.parse(body)));
}