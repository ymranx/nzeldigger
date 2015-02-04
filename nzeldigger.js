var request    = require('request'),
    events     = require('events');
	
var nzelDigger = function(accessToken) {
    var _this         = this;
    this.accessToken  = accessToken;
    this.page         = 1;
    this.per_page     = 50;
    this.baseJobUrl   ='https://api.angel.co/1/jobs';
    this.lastPage     = 0;
    var pageHandler   = requestJobList(this.baseJobUrl + '?page=1&per_page=1&access_token=' + this.accessToken);
   
    pageHandler(function(error, response, body) {
      if(error) {
         _this.emit('error', error);
         return;
      }
       _this.lastPage = Math.ceil(JSON.parse(body).total/50);
	   console.log( _this.lastPage);
       _this.emit('ready');
    });
}
nzelDigger.prototype.__proto__ = events.EventEmitter.prototype;

nzelDigger.prototype.getJobs = function() {
  var _this = this,
	  curUrl= '';
  return function*() {
    while(_this.page <= _this.lastPage) {
	curUrl = _this.baseJobUrl +'?page=' + _this.page++ + '&per_page=50&access_token=' + _this.accessToken;
	console.log(curUrl);
        yield requestJobList(curUrl);
    }
  }
}
function requestJobList(jobUrl) {
  return function(callback){
    request(jobUrl, function(error, response, body){
      callback(error, response, body);
    });
  }
}

module.exports = nzelDigger;
