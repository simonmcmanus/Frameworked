exports.getData = function(callback) {
	callback( null, {
		moduleName: 'task', 
		selectors: { li: ['task1', 'task2', 'task3'] } 
	} );
};