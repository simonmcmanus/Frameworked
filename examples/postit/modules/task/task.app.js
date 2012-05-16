exports.getData = function(callback, params) {
	callback( null, {
		moduleName: 'task',
		selectors: {
			'li': [
				{ '.title': 'item1', '.text': 'naaaaaa'},
				{ '.title': 'item2', '.text': 'naaaaaa'},
				{ '.title': 'item3', '.text': 'naaaaaa'}
			]
		}
	});
};
