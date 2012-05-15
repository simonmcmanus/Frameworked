

var pi = {
	urls: {
		workspace: '/$workspace/',
		task: '/$board/task/$id/',	
		taskEdit: '/lists/smm/tasks/$id/edit/',
		comment: '/task/$id/comment/$id/',
		comments: '/task/$idcomments/'
	},
	base: {
		init : function(selector) {
		},
		open: function() {
			this.domNode.show();
		},
		close: function() {
			that.domNode.hide();
		},
		update: function() {

		},
		bind: function(selector) {
			this.domNode = $(selector);			
		},
		listen: function(event, callback) {
			// register callback
			callback(data);
		}
	}
};

var ckEditorConfig = {
	extraPlugins : 'autogrow',
	removePlugins : 'resize elementspath',
	toolbar: 'Basic',
	toolbar_Basic: [   [ 'Bold', 'Italic' ] ],
	autoUpdateElement: true /* TODO: use textarea */

};

$(window).bind('popstate', function(event) {
    // if the event has our history data on it, load the page fragment with AJAX
    var state = event.originalEvent.state;
	console.log(state);
    if (state) {
		var path = state.path.replace(window.location.host , "");
		
		if(path == 'http:///test/'){
			alert('load: '+path);
			close();
		}
    }
});


history.replaceState({ path: window.location.href }, '');


 

pi.ui = {};

pi.events = $({});

pi.views = {};

var base = {
	uis: [],
	open : function(uis) {
		scope.uis = uis;
		var c = this.uis.length;
		while(c--) {
			this.uis[c].open();
		}
	},
	close: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].close();
		}
	},
	update: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].update();
		}		
	},
	delete: function() {
		var c = this.uis.length;
		while(c--) {
			this.uis[c].doDelete();
		}
	},
	add: function(ui) {
		this.uis.push(ui);
	}
};



var view = function(options) {
	var that = this;
	var scope = {};
	new overlay();
	scope.init = function() {
		for(option in options){
			console.log([option]);
			scope[option] = new window[option](options[option]);
		}
	}
	
	scope.open = function() {
		console.log('sc', scope.task.domNode);
		scope.overlay.open();
		scope.task.open();
		scope.header.close();
	}
	scope.init();	
	return scope;
}
view.prototype = base;
view.constructer = base;


pi.views.board = function() {
	var that = this;
	var init = function() {
		findTasks();
		if(isLoggedIn()){
			makeSortable();
			setupLoggedInNav();
		}		
	};
	
	
	var isLoggedIn = function() {
		// TODO - make more resiliant.
		if($('.username').length > 0) {
			$('body').addClass('authenticated');
			return true;
		}else {
			$('body').removeClass('authenticated');
			return true;
		}
	};
	
	var setupLoggedInNav = function() {
		up($('li.user .sublinks'));
		$('li.user').click(function(e) {
			e.preventDefault();
			if($(this).find('.sublinks.down').length == 0){
				down($(this).find('.sublinks'));
			}else {
				up($(this).find('.sublinks'));
			}
		});
		$('li.user .sublinks a').click(function() {
			window.location = $(this).attr('href');
		});
	};
	
	var down = function($node) {
		$node.animate({
			top:'+=10em'
		}, 300);
		$node.addClass('down');
	};
	
	var up = function($node) {
		$node.animate({
			top:'-=10em'
		}, 300);
		$node.removeClass('down');
	};


	var makeSortable = function() {
		$( "ul.tasks" ).sortable({
			connectWith: ".tasks",
			placeholder: "placeholder",
			forcePlaceholderSize: true,
			update: changeTasks 
		}).disableSelection();

	};
	
	
	var changeTasks = function(event, ui) {
		var s = $(this).sortable('toArray').join(', ');
		that.postTasks($(this).attr('id'), s);
	};
	var findTasks = function() {
		$('.tasks li').each(function() {
			that.uis.push(new pi.ui.task(this));
			
		});
	};
	that.postTasks = function(status, ids) {
		console.log(ids, status);

		$.ajax({
			type:"POST",
			url:"/lists/smm/status/"+status+"/edit/",
			data:'ids='+ids,
			success: function(data) {
				console.log('data', data);
			}
		})
	};
	
	pi.events.bind('openTask', function(e, id) {
		pi.views.task.open(id);
	});
	
	
	init();
	return this;
};

pi.views.board.prototype = base;
pi.views.board.constructer = base;



$(document).ready(function() {
	pi.views.board = new pi.views.board();
});




pi.ui.task = function(selector) {
	var that = this;
	that.id = null;
	var init = function(selector) {
		that.domNode = $(selector);
		that.id = that.domNode.attr('id');
		that.domNode.find('.delete').click(confirmDelete);
		that.domNode.find('.edit').click(that.open);
		that.domNode.find('.close').click(closeClick);
		// listfor(taskUpdate, newComment, edit);
	};

	
	var url = function() {
		return pi.urls.task.replace('$id', that.id).replace('$board', $('.wall').html());
	};
	
	that.get = function(callback) {
		$.ajax({
			url: url(),
			success: callback
		});	
	};
	
	that.update = function() {
		that.get(function(data) {
			that.domNode.replaceWith(data);
		});	
	};
	
	var doDeleteClick = function(e){
			e.preventDefault();
			that.doDelete();	
			return false;
	};
	
	that.doDelete = function() {
		var width = that.domNode.width();
		var pos = width / 2;
		var $img = $('<img src="/public/img/smoke.png" class="smokePuff" />');
		$img.css({
			left:pos,
			position:'absolute',
			'margin-left': '53px',
		    'margin-top': '-10px'
		});
		that.domNode.children().fadeOut();
		pi.ui.overlay.close();
		vtip2.close();
		that.domNode.animate({
			width:20,
			'margin-left':pos,
			height: 20
		}, 100, function() {
			that.domNode.parent().append($img);

			$img.css({
				position:'absolute',
				'margin-left':pos,
				top:that.domNode.position().top,
				left: that.domNode.position().left
			});
			that.domNode.hide();
			$img.animate({
				width:'+=60',
				height:'+=60',
				top:'-=40',
				left:'-=60',
			}, 400)
			.animate({
				top:$('#deleted').offset().top	
			}, 400, function() {
				$(this).fadeOut('fast');
				that.domNode.appendTo('#deleted').fadeIn().css({width:'auto'}).find('section').show();;
			})

		//	that.domNode.hide();
		});
		pi.views.board.postTasks('deleted', that.domNode.attr('id'));
		return false;			

	};
	

	var cancelDeleteClick = function(e) {
		e.preventDefault();
		cancelDelete();
	};

	var cancelDelete = function() {
		pi.ui.overlay.close();
		vtip2.close();
	};
	
	var confirmDelete = function(e) {
		e.preventDefault();
		$('#vtip').append('<hr/><p>are you sure? </p> <button href="#" class="no">no</button> <button href="#" class="yes">yes</button>');
		$('#vtip').addClass('enabled');
		$('#vtip .yes').click(doDeleteClick); 
		$('#vtip .no').click(cancelDeleteClick); 
		pi.ui.overlay.open();
	};
	
	
	that.open = function(e) {
		e.preventDefault();
		pi.events.trigger('openTask', [$(this).parents('li').attr('id')]);
	};
	
	
	var closeClick = function(e)  {
		e.preventDefault();
		pi.events.trigger('closeTask');
		return false;
	};
	
	that.post = function() {
		var title = that.domNode.find('[name=title]')[0].value;
		$.ajax({
			type: "POST",
			url: url(),
			data: 'list="'+$('.wall').html()+'"&title="'+title+'"&text="'+encodeURIComponent(editor.getData())+'"',
			success: function(data) {
				that.domNode.find('.saving').html('Saved').fadeOut(1000, function() {
					$(this).remove();
				});
			}
		})		
	};
	that.save = function() {
		e.preventDefault();
		that.domNode = $('li.open');
		that.domNode.append('<div class="saving">Saving...</div>');
		that.post();
	};
	init(selector);
	return that;
}

pi.ui.task.prototype = pi.base;
pi.ui.task.contstructor = pi.constructor;


