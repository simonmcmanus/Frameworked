var structure = require('frameworked');


structure.serve({
	port: 802,
	layout: 'layout',
	container: '#contents',
	location: __dirname,
	pageSpecs: {
		'/tasks': {
			view: 'collection',
			modules: {
			/* 	'#footer': 'test', Should support strings. */
				'#notStarted': {   /* Should support objects. */
					module: 'task',
					params: {
						status: 'notStarted'
					}
				},
				'#inProgress': {
					module: 'task',
					params: {
						status: 'inProgress'
					}
				},
				'#done': {
					module: 'task',
					params: {
						status: 'done'
					}
				}
			}
			/* , parameters: {
				taskSize: 'small'
			} */
		}
	}
});
