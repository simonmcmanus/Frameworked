exports.getData = function(callback) {
	callback( null, {
		moduleName: 'task', 
		selectors: { 'ul#notStarted li': [
				{ selectors: { '.title': 'item1', '.text': 'aaaaaa'} }, 
				{ selectors: { '.title': 'item2', '.text': 'aaaaaa'} }, 
				{ selectors: { '.title': 'item3', '.text': 'aaaaaa'} }
			]
		} 
	});
};

