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
			modules: ['task', 'test' /*  'tasks:notStarted', 'tasks:inProgress','tasks:done' */ ],


			/* This is a nice was to define the modules, allowing for reuse. it gets round the problem
				of uniquite ids to tasks used multiple times.

			*/

			m: {
				'#footer': 'test', /* Should support strings. */
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
