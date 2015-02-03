module.exports = (function() {
	var getBasicProperties = function getBasicProperties(jobData) {
		var ignoreList = {
			tags : '',
			startup : ''
		};
		var newObj = {};
		Object.keys(jobData).forEach(function(key) {
			if(!(key in ignoreList)) {
				newObj[key] = jobData[key];
			}
		});
		return newObj;
	};

	var getTags = function getTags(jobData) {
		return jobData.tags;
	};

	var getStartup = function getStartup(jobData) {
		return jobData.startup;
	};

	return {
		getBasicProperties : getBasicProperties,
		getTags			   : getTags,
		getStartup         : getStartup
	};
})();