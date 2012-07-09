window.jumpui = {};

/*
 * App class
 */
jumpui.JqmApp = Backbone.Model.extend({
	initialize:function() {
		if(this.attributes.platform==undefined) {
			throw "Platform is not specified for this app";
		}
		if(this.attributes.containerEl==undefined) {
			throw "containerEl is not specified for this app";
		}
		_.extend(this, this.attributes);
		this.pages={};
		this.router = new Backbone.Router();
		this.platform.setup();
	},
	load: function() {
		if(this.pages.length<=0) {
			throw("No pages found in app");
		}
		var self = this;
		//SETUP ROUTER
		_.each(this.pages,function(page) {
			self.router.route(page.route, page.name, function(){
				var args = arguments;
				//prepare page
				page.prepare.apply(page, args);
				_.each(page.blocks, function(block){
					//prepare block
					if(block.prepare) { block.prepare.apply(block.prepare, args)};
				});
				//Load page
				page.load($(self.containerEl));
				self._jQChangePage(page);
				
				//Removing old page;
				// if(self.currentPage) {
				// 					console.log('destroying old page');
				// 					self.currentPage.remove();
				// 				}
				self.currentPage = page;
			});
		});
		
		//Remove hidden DOM page
		$(this.containerEl).live('pageshow', function(event, ui) {
		    $(ui.prevPage).remove();
		});
		
		//START APP
		//this.goto(_.keys(this.pages)[0]);
		Backbone.history.start();
	},
	addPage:function(page) {
		page.app = this;
		this.pages[page.name] = page;
	}
	,
	// goto:function(pageNameOrPage) {
	// 		if(pageNameOrPage==undefined) {
	// 			throw("pageName not defined");
	// 		}
	// 		if($(this.containerEl).length<=0) {
	// 			throw('containerEl is not available in DOM. containerEl: ' + this.containerEl);
	// 		}
	// 
	// 		var page = undefined;
	// 		if(_.isObject(pageNameOrPage)) {
	// 			page = pageNameOrPage;
	// 		} else {
	// 			page = this.pages[pageNameOrPage];
	// 		}
	// 		
	// 		if(!page.isLoaded()) {
	// 	 		page.load($(this.containerEl));
	// 	 	}
	// 		this._jQChangePage(page);
	// 	},
	_jQChangePage:function(page) {
		$.mobile.changePage($(page.el));
	}
});


/* ######## PLATFORM ############# */
/*
 * Platform class Web,Cordova
 */
jumpui.Platform = Backbone.Model.extend({
	setup:function(){
		console.log('in setup');
		$(document).bind("mobileinit", function(){
			console.log('hash listening false');
			$.mobile.ajaxEnabled = false;
		    $.mobile.linkBindingEnabled = false;
		    $.mobile.hashListeningEnabled = false;
		    $.mobile.pushStateEnabled = false;
		});
	}
});

jumpui.Platform.CORDOVA = new jumpui.Platform({
	setup:function(){
		$.mobile.ajaxEnabled = false;
	    $.mobile.linkBindingEnabled = false;
	    $.mobile.hashListeningEnabled = false;
	    $.mobile.pushStateEnabled = false;
	}
});

jumpui.Platform.WEB = new jumpui.Platform({
	
});
var fun1 = function() {
 console.log(this);
}
/* ######## PLATFORM END ############# */jumpui.template = {};
jumpui.template.engine = {};
jumpui.Template = Backbone.Model.extend({
	initialize:function(src) {
		this.src = src;
	},
	parse: function(templateKey, model){
		return templateKey;
	}
});

jumpui.template.engine.Underscore = jumpui.Template.extend({
	parse:function(templateKey, model) {
		throw("UNDERSCORE not implemented yet");
	}
});
jumpui.template.engine.Handlebars = jumpui.Template.extend({
	parse:function(templateKey, model) {
		var source   = $("#"+templateKey).html();
		var template = Handlebars.compile(source);
		return template(model);	  
	}
});jumpui.block = {};
jumpui.Block = Backbone.View.extend({
	tagName: "div",
	initialize:function(){
		_.extend(this, this.options);
		
	},
	render:function(){
		var $el = $(this.el);
		$el.empty();
		if(this.templateKey) {
			$el.append(this.page.app.templateEngine.parse(this.templateKey, this.model));
			return;
		} 
		if(this.getContent!=null) {
			//$(this.el).empty().append($(this.getContent()));
			$(this.el).empty().append($(this.getContent()));
		} else {
			return $(this.el).empty().append("<p>Default Block Content</p>");
		}
	}
});

jumpui.block.Header = jumpui.Block.extend({
	className: "jump-header",
	attributes: {
		'data-role': "header"
	}
});

jumpui.block.Footer = jumpui.Block.extend({
	className: "jump-footer",
	attributes: {
		'data-role': "footer"
	}
});

jumpui.block.Content = jumpui.Block.extend({
	className: "jump-content",
	attributes: {
		'data-role': "content"
	}
});jumpui.Page = Backbone.View.extend({
	tagName: "div",
	className: "jump-page",
	attributes: {
		'data-role': "page"
	},
	//blocks:{},
	initialize:function(options){
		if(options == undefined || options.name==undefined) {
			throw ("name property is compulsory");
		}
		if(options.prepare==undefined) {
			throw ("prepare property is compulsory");
		}
		_.extend(this,options);
		this.id=options.name;
		this.loaded=false;
		if(this.route == undefined) {
			this.route = this.name;
		}
		this.setBlocks(options.blocks || {});
	},
	setBlocks:function(blocks) {
		var self =this;
		//_.extend(this.blocks, blocks);
		this.blocks = blocks;
		_.each(this.blocks, function(block) { block.page = self; });		
	},
	isLoaded:function(){
		return false;
		//return this.loaded;
	},
	load:function(container) {
		container.append(this.el);
		$(this.el).page();
		this.loaded=true;
	},
	// remove:function() {
	// 		$(this.el).remove();
	// 		this.loaded=false;
	// },
	render: function() {
		console.log('Rendering ' + this.name, this);
		var self = this;
		$(self.el).empty();
		_.each(_.keys(this.blocks), function(blockKey) {
			var block = self.blocks[blockKey];
			if(block.model==undefined) {
				block.model = {};
			}
			_.extend(block.page.model, block.model);
			block.render();
			console.log(self.name + ": EL: ", block.el);
			$(self.el).append(block.el);
		});
	}
});