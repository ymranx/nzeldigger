var nzelDigger = require('./nzeldigger');

var access_token = 'Your-Angel-List-access-Token';
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