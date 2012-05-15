module.exports = function(params) {
		exports.getData = function(callback) {
		callback( null, {
			moduleName: 'task',
			selectors: {
				'ul#notStarted li': [
					{ selectors: { '.title': 'item1', '.text': 'naaaaaa'} },
					{ selectors: { '.title': 'item2', '.text': 'naaaaaa'} },
					{ selectors: { '.title': 'item3', '.text': 'naaaaaa'} }
				]
			}
		});
	};
	return exports;
};
