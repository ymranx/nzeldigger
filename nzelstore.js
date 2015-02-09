var mysql    = require('mysql'),
	helper   = require('./nzelhelper');

var nzelStore = function(host, user, pass) {
	this.connection = mysql.createConnection({
		  host     : host,
		  user     : user,
		  password : pass
	});
};
nzelStore.prototype.connect = function() {
	var con = this.connection;
	return function(callback) {
		con.connect(callback);
	}
};
nzelStore.prototype.save = function(jobData) {
	var jobJson = JSON.parse(jobData).jobs;
	
	for(var i in jobJson) {
	    saveToMySql.call(this, jobJson[i]);
	}	
}
nzelStore.prototype.disconnect = function() {
	var con = this.connection;
	return function(callback) {
		con.end(callback);
	}
}
/*
basicProp = helper.getBasicProperties(jobJson[i]);*/
module.exports = nzelStore;

//####################################################

var saveToMySql = function saveToMySql(jobData) {
	var insertJobs     = 'INSERT INTO nzelo.Jobs Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		insertTags     = 'INSERT INTO nzelo.Tags Values(?, ?, ?, ?, ?)',
		tInsertTags    = '',
		insertJobtags  = 'INSERT INTO nzelo.JobsTags Values(?, ?, ?)',
		tInsertJobtags = '',
		insertStartup  = 'INSERT INTO nzelo.Startups Values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		
		jobs     = helper.getBasicProperties(jobData),
		tags     = helper.getTags(jobData),
		startup  = helper.getStartup(jobData),
		_this    = this;
	
	var jobValues   = [ 
			jobs.id,
			jobs.title, 
			jobs.description,
			jobs.created_at,
			jobs.updated_at,
			jobs.equity_cliff, 
			jobs.equity_min,
			jobs.equity_max, 
			jobs.equity_vest,
			jobs.currency_code,
			jobs.job_type,
			jobs.salary_min,
			jobs.salary_max,
			jobs.angellist_url,
			jobs.remote_ok,
			startup.id 
	];
	var startupValues = [
			startup.id,
			startup.hidden,
			startup.community_profile,
			startup.name,
			startup.angellist_url,
			startup.logo_url,
			startup.thumb_url,
			startup.quality,
			startup.product_desc,
			startup.high_concept,
			startup.follower_count,
			startup.company_url,
			startup.created_at,
			startup.updated_at
	];
	var tagValues    = [];
	var jobtagValues = [];
	insertJobs    = mysql.format(insertJobs, jobValues);
	insertStartup = mysql.format(insertStartup, startupValues);
	//console.log(queryStr);
	
	_this.connection.query(insertJobs, function(err, rows, fields) {
		if (err){
			console.error(err);
		}
		_this.connection.query(insertStartup, function(err, rows, fields) {
			if (err) {
				if(err.errno!==1062) {
					console.error(err);
				}
			}
		});
		
		for(var i=0; i<tags.length; i++) {
			tagValues = [
				tags[i].id,
				tags[i].tag_type,
				tags[i].name,
				tags[i].display_name,
				tags[i].angellist_url,
			];
				
			jobtagValues = [
				null,
				jobs.id,
				tags[i].id
			];
		    tInsertTags    = mysql.format(insertTags, tagValues);
			tInsertJobtags = mysql.format(insertJobtags, jobtagValues);
			_this.connection.query(tInsertTags, function(err, rows, fields) {
				if (err) {
					if(err.errno!==1062) {
						console.error(err);
					}
				}
		   });
		   _this.connection.query(tInsertJobtags, function(err, rows, fields) {
				if (err) {
					if(err.errno!==1062) {
						console.error(err);
					}
				}
		   });
		}
		
	});
};