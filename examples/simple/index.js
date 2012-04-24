var structure = require('frameworked');

structure.serve({
	port: 802,
	layout: 'layout',
	container: '#contents',
	sharedModules: [],
	location: __dirname,
	pageSpecs: {
		'/tasks': {
			view: 'collection',
			modules: ['task', 'test']
			/* , parameters: {
				taskSize: 'small'
			} */
		}
	}
});
