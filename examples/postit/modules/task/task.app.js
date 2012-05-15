exports.getData = function(callback) {
	callback( null, {
		moduleName: 'task',
		selectors: {
			'ul#notStarted li': [
				{ selectors: { '.title': 'item1', '.text': 'naaaaaa'} },
				{ selectors: { '.title': 'item2', '.text': 'naaaaaa'} },
				{ selectors: { '.title': 'item3', '.text': 'naaaaaa'} }
			],
			'ul#inProgress li': [
				{ selectors: { '.title': 'item1', '.text': 'iaaaaaa'} },
				{ selectors: { '.title': 'item2', '.text': 'iaaaaaa'} },
				{ selectors: { '.title': 'item3', '.text': 'iaaaaaa'} }
			],
			'ul#done li': [
				{ selectors: { '.title': 'item1', '.text': 'daaaaaa'} },
				{ selectors: { '.title': 'item2', '.text': 'daaaaaa'} },
				{ selectors: { '.title': 'item3', '.text': 'daaaaaa'} }
			]
		}
	});
};

