/* ######## APP ############# */
window.jumpui = {};
/*
 * JqmApp is application class, There should be only one instance per app.
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
	load: function(options) {
		options = options || {};
		if(this.pages.length<=0) {
			throw("No pages found in app");
		}
		var self = this;
		//SETUP ROUTER
		_.each(this.pages,function(page) {
			self.router.route(page.route, page.name, function(){
				var args = arguments;
				//prepare page
				var allowed = false;
				allowed = page.prepare.apply(page, args);
				//exit function
				if(!allowed) { return; }
				_.every(page.blocks, function(block){
					//prepare block
					if(block.prepare) {
						allowed = block.prepare.apply(block, args);
						//break loop if false
						return allowed;
					}
				});
				//exit function.
				if(!allowed) { return; }
				
				page.render();
				//Load page
				page.load($(self.containerEl));
				// FIRST TIME |OR| Different page
				//if(!self.currentPage || (self.currentPage && self.currentPage.name != page.name)) {
					self._jQChangePage(page);
				//}
				self.currentPage = page;
				$(page.el).trigger('jui-pageloaded');
			});
		});
		
		//Remove hidden DOM page
		$(this.containerEl).live('pageshow', function(event, ui) {
		    $(ui.prevPage).remove();
		});
		
		//START APP
		//this.goto(_.keys(this.pages)[0]);
		Backbone.history.start();
		// if(window.location.hash=="#" || window.location.hash.length==0) {
		// 			if(options.rootPage==undefined) {
		// 				this.navigate(_.values(this.pages)[0].name);
		// 			} else {
		// 				this.navigate(options.rootPage);
		// 			}
		// 		}
	},
	addPage:function(page) {
		page.app = this;
		if(this.theme) {
			page.attributes['data-theme'] = this.theme;
		}
		this.pages[page.name] = page;
	},
	navigate:function(route) {
		this.router.navigate(route, {trigger:true});
	},
	_jQChangePage:function(page) {
		$.mobile.changePage($(page.el));
	}
});


/* ######## PLATFORM ############# */
/*
 * Specifies platform on which this application should run.
 * i.e. WEB, CORDOVA
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
/* ######## PLATFORM END ############# *//* ######## TEMPLATE ############# */
jumpui.template = {};
jumpui.template.engine = {};
jumpui.TemplateEngine = Backbone.Model.extend({
	parse: function(templateKey, model){
		return templateKey;
	}
});

jumpui.template.engine.Underscore = jumpui.TemplateEngine.extend({
	parse:function(templateKey, model) {
		throw("UNDERSCORE not implemented yet");
	}
});
jumpui.template.engine.Handlebars = jumpui.TemplateEngine.extend({
	initialize:function(options) {
		_.extend(this,options);
		
		//REGISTER HELPERS
		var helpers = this.helpers || {};
		_.each(_.keys(helpers), function(helperKey){
			Handlebars.registerHelper(helperKey, helpers[helperKey]);
		})
	},
	parse:function(templateKey, model) {
		var source   = $("#"+templateKey).html();
		var template = Handlebars.compile(source);
		return template(model);	  
	}
});/* ######## BLOCK ############# */
jumpui.block = {};
jumpui.Block = Backbone.View.extend({
	tagName: "div",
	initialize:function(){
		_.extend(this, this.options);
		
	},
	render:function(){
		$(this.el).remove();
		this.setElement(this.make(this.tagName, this.attributes));
		var $el = $(this.el);
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
});/* ######## PAGE ############# */
jumpui.Page = Backbone.View.extend({
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
		// $(this.el).trigger('create');
		this.loaded=true;
	},
	// remove:function() {
	// 		$(this.el).remove();
	// 		this.loaded=false;
	// },
	_createDom: function() {
		var self = this;
		//NOTE: $(self.el).remove(); GETS REMOVED when page transition complete, so not removing here. 
		this.setElement(this.make(this.tagName, this.attributes));
		_.each(_.keys(this.blocks), function(blockKey) {
			var block = self.blocks[blockKey];
			if(block.model==undefined) {
				block.model = {};
			}
			_.extend(block.model, block.page.model);
			//_.extend(block.page.model, block.model);
			block.render();
			//console.log(self.name + ": EL: ", block.el);
			$(self.el).append(block.el);
		});
	},
	render: function() {
		console.log('Rendering ' + this.name, this);
		this._createDom();
		$(this.el).trigger('jui-pagerendered');
	}
});