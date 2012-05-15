exports.getData = function(callback) {
	callback( null, {
		moduleName: 'test',
		selectors: { li: ['test1', 'test2', 'test3'] }
	} );
}; 