/*


REQUIREMENTS : 

compile modules and views from json.
allow modules to be exposed over http at different levels of granularity
provide an easy mechanism for auto updating and adding web sockets
output valid html.


** REALTIME
== serve client side code to lsten for events
== provide serverside code to fire events
== provide clientside code to fire events,

*/

var fs = require('fs');
var express = require('express');
var app = express.createServer();
var Step = require('step');
var sizlate = require('sizlate');

var buildPageNow = function(page, options, callback) {
	var spec = options.pageSpecs[page];
	var viewHtml;
	var layoutHtml;
	var viewSelectors;
	var moduleMappings = {};
	var moduleMappingCounter = 0;
	var modulesHtml = {};
	var modulesSelectors;
	
	Step(
		function getLayoutHtml() {
			var layout = (options.layout) ? options.layout : 'layout';
			fs.readFile(options.location + '/views/' + layout + '/' + layout + '.html', 'utf8', this.parallel());
		},
		// todo - get layout data - logged in
		function getViewHtml(error, _layoutHtml) {
			if(error) console.log('ERROR - There was a problem loading the html for the layout. ', error);
			layoutHtml = _layoutHtml;
			fs.readFile(options.location + '/views/' + spec.view + '/' + spec.view + '.html', 'utf8', this.parallel());
		},
		// todo - get View data
		function getModuleHtml(error, _viewHtml) {
			if(error) console.log('ERROR - There was a problem loading the html for the view. ', error);
			viewHtml = _viewHtml;


//			var modules = spec.modules.concat(options.sharedModules); // include shared modules.

			var group = this.group();
			var modules = spec.modules;

			for(var module in modules) {
				//console.log(module, modules[module].module, modules[module].params);
				moduleMappings[moduleMappingCounter++] = {
					selector: module,
					module:  modules[module].module,
					params:  modules[module].params
				}; // keep track of the requested order so that we can access the later in the group an know which module they are from.
				var path = options.location + '/modules/' + modules[module].module + '/' + modules[module].module + '.html';
				fs.readFile(path, 'utf8', group());

			}
		},
		function getModulesData(error, _modulesHtml) {
			if(error) console.log('ERROR - There was a problem loading the html for at least one of your modules. ', error);
			var c = _modulesHtml.length;
			while(c--) {
				modulesHtml[moduleMappings[c].module] = _modulesHtml[c]; // use name as id to store html for later use
/* exports.modules is not being set - */
console.log(moduleMappings[c].module, exports.modules);
				if(exports.modules[moduleMappings[c].module].getData) {

					exports.modules[moduleMappings[c].module].getData(this.parallel());
				} else {
					viewSelectors[ moduleMappings[c].selector ] = _modulesHtml[c];
				}
			}
		},
		function buildHtml(error) {
			if(error) console.log('ERROR - There was a problem getting the selectors for at least one of your modules. ', error);
			var selectors = [];
			var modulesData = arguments;

			var c = modulesData.length;
			while(c--) {
				if(modulesData[c]) {
					var moduleHtml = modulesHtml[modulesData[c].moduleName];
					var moduleSelectors = modulesData[c].selectors;
					moduleHtml = sizlate.doRender(moduleHtml, moduleSelectors); // render module before attaching to the page
					selectors['#' + modulesData[c].moduleName] = moduleHtml; // modules mappings is wrong here.
				}
			}
			viewHtml = sizlate.doRender(viewHtml, selectors);
			var container = (options.container) ? options.container : '#container';
			var pageSelectors = {};
			pageSelectors[ container ] = viewHtml;
			var pageHtml = sizlate.doRender(layoutHtml, pageSelectors);
			return pageHtml;
		},
		function moveStyleToHead(error, pageHtml) {
			var browser = require("jsdom/lib/jsdom/browser");
			var dom = browser.browserAugmentation(require("jsdom/lib/jsdom/level2/core").dom.level2.core);
			var doc = new dom.Document("html");
			doc.innerHTML = pageHtml;
			var linkTags = doc.getElementsByTagName('link');
			var c = linkTags.length;
			var head = doc.getElementsByTagName('head')[0];
			while(c--) {
				var link = doc.createElement('link');
				link.setAttribute('href', linkTags[c].href);
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('type', 'text/css');
				// todo - support different media types
				head.appendChild(link);
				linkTags[c].parentNode.removeChild(linkTags[c]);
			}
			/*
			TODO - remove this hack - something is stripping the doctype. it should not be.
			*/
			return '<!doctype html>' + doc.innerHTML;
		},
		callback
    );
};

exports.modules = {};
var loadModules = function(options) {
	for(var page in options.pageSpecs){
		var modules = options.pageSpecs[page].modules;
		for (var module in modules) {
			var moduleName = modules[module].module;
			var path = options.location + '/modules/' + moduleName + '/' + moduleName + '.app.js';
			exports.modules[moduleName] = require(path); //todo - need to pass in params here.
		}
	}
};
/*
Expects:
{	port: 802,
	sharedModules: [],
	location: __dirname,
	pageSpecs: {
		'/tasks': {
			view: 'collection',
			modules: ['task', 'test']
		}
	}
}
*/

exports.serve = function(options) {
	loadModules(options);
	var pages = options.pageSpecs;
	// wrapper function required. ? check
	for(var page in options.pageSpecs) {
		app.get(page,  function(req, res) {
			buildPageNow(page, options, function(error, pageHtml) {
				res.send(pageHtml);
			});
		});
	}
/*
todo - this currrently exposes serverside logic.
*/
	app.get('/modules/:module/:file', function(req, res) {
		res.download(options.location + '/modules/' +req.params.module + '/' + req.params.file);
	});
	app.get('/views/:view/:file', function(req, res) {
		res.download(options.location + '/views/' +req.params.view + '/' + req.params.file);
	});
	app.listen(options.port);
};




