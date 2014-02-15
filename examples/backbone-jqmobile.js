/* ####### SET JQUERY MOBILE DEFAULTS ######## */
$(document).bind("mobileinit", function(){
	console.log('setting Jquery mobile on mobile init');
 	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
});

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
		// var self = this;
		// //SETUP ROUTER
		// _.each(this.pages,function(page) {
		// 	self._registerPage(page);
		// });
		
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
		if(this.router==undefined) {
			throw('Cannot add page before router is set in Application');
		}
		page.app = this;
		if(this.theme) {
			page.attributes['data-theme'] = this.theme;
		}
		this._registerPage(page);
		this.pages[page.name] = page;
	},
	navigate:function(route) {
		this.router.navigate(route, {trigger:true});
	},
	_registerPage:function(page) {
		var self = this;
		this.router.route(page.route, page.name, function(){
			var args = arguments;
			if(page._load(args,$(self.containerEl))) {
				if(self.currentPage) {
					self.currentPage.visible = false;
				}
				self.currentPage = page;
				self.currentPage.visible = true;
				$(page.el).trigger('jui-pageloaded');
			} else {
				console.log('Not loading page ' + page.name + " as process returned negetive");
			}
		});
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
	initialize:function() {
	},
	setup:function(){
	}
});

jumpui.Platform.CORDOVA = new jumpui.Platform({
});

jumpui.Platform.WEB = new jumpui.Platform({
	
});
/* ######## PLATFORM END ############# */
jumpui.internal = {};
jumpui.internal.AbstractView = Backbone.View.extend({
	initialize:function(){
		_.extend(this, this.options);
		
		if (this.ui) {
			var self = this;
		    if(!this._ui){
	            this._ui = _.clone(this.ui);
	        }

	        var uiList = this._ui;
	        _.each(uiList, function(value, key) {
	            console.log("fetch " + key + ", " + value);
	            self.ui[key] = self.$(value);            
	        });
		}
		
		if(this.init) {
			this.init();
		}
	},
	
	// clears the view for garbage-collection
	close: function() {
	    this.remove();
	    this.unbind();
	    if (this.onClose) {
	        this.onClose();
	    }
	}
});
/* ######## TEMPLATE ############# */
jumpui.template = {};
jumpui.template.engine = {};
jumpui.TemplateEngine = Backbone.Model.extend({
	parse: function(template, model){
		return template;
	}
});

jumpui.template.engine.Underscore = jumpui.TemplateEngine.extend({
	parse:function(template, model) {
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
	parse:function(template, model, fragments) {
		var source   = $("#"+template).html();
		return this.parseHtml(source, model, fragments);
	},
	parseHtml: function(source, model, fragments) {
		var template = Handlebars.compile(source);
		model.fragments = fragments;
		return template(model);
	},
	registerPartial: function(partialKey){
		Handlebars.registerPartial(partialKey, $("#"+partialKey).html());
	}
});jumpui.fragment = {};
jumpui.Fragment = jumpui.internal.AbstractView.extend({
	initialize:function(){
		jumpui.internal.AbstractView.prototype.initialize.apply(this, arguments);
		this.dataFragment = this.template;
	},
	getModel:function(){
		return {};
	},
	render:function(){
		if(this.$el) {
			this.$el.empty();
		}
		//this.setElement(this.make(this.tagName, this.attributes));
		//var $el = $(this.el);
		if($.isFunction(this.template)) {
			this.$el.append(this.block.page.app.templateEngine.parseHtml(this.template(this.model), this.getModel()));
			return;
		} else if(this.template!=undefined) {
			this.$el.append(this.block.page.app.templateEngine.parse(this.template, this.getModel()));
			return;
		} 
		if(this.getContent!=null) {
			//$(this.el).empty().append($(this.getContent()));
			$(this.el).empty().append($(this.getContent()));
		} else {
			throw('Neither template nor getContent method found');
		}
	},
	createHtml:function(templateEngine, model) {
		//var containerEl = this.make(this.tagName, this.attributes);
		return "<"+this.tagName+" id='" + this.id + "'>" + templateEngine.parse(this.template, model) + "</" + this.tagName + ">";
	},
	_setEl:function(element){
		//this.setElement(context.$("#"+this.id));
		this.setElement(element);
	}
});/* ######## BLOCK ############# */
jumpui.block = {};
jumpui.Block = jumpui.internal.AbstractView.extend({
	tagName: "div",
	fragments:{},
	initialize:function(){
		jumpui.internal.AbstractView.prototype.initialize.apply(this, arguments);
		var self=this;
		_.each(this.fragments,function(fragment) {
			fragment.block = self;
		});
	},
	render:function(){
		$(this.el).remove();
		this.setElement(this.make(this.tagName, this.attributes));
		var $el = $(this.el);
		if(this.template) {
			//FRAGMENT Processing
			var self = this;
			var renderedFragments={};
			if($.isFunction(this.template)) {
				$el.append(this.page.app.templateEngine.parseHtml(this.template(this.model), this.model, renderedFragments));			
			} else if(this.template!=undefined) {
				$el.append(this.page.app.templateEngine.parse(this.template, this.model, renderedFragments));			
			}

			_.each(this.fragments, function(fragment,key){
				fragment._setEl(self.$('[data-fragment='+key+']'));
				fragment.render(); 
			});
			return;
		}
		if(this.getContent!=null) {
			//$(this.el).empty().append($(this.getContent()));
			$(this.el).empty().append($(this.getContent()));
		} else {
			throw('Neither template nor getContent method found');
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
		_.bindAll(this, 'reload');
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
		
		// If page has ui map then convert into the ui-element-map
		if (this.ui) {
		    if(!this._ui){
	            this._ui = _.clone(this.ui);
	        }

	        var uiList = this._ui;
	        _.each(uiList, function(value, key) {
	            console.log("fetch " + key + ", " + value);
	            self.ui[key] = self.$(value);            
	        });
		}
		
		if(this.init) {
			this.init();
		}
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
	_attachAndProcess:function(container) {
		container.append(this.el);
		$(this.el).page();
		// $(this.el).trigger('create');
		this.loaded=true;
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
	},
	_load:function(args, container){
		//prepare page
		var allowed = false;
		allowed = this.prepare.apply(this, args);
		//exit function
		if(!allowed) { return; }
		_.every(this.blocks, function(block){
			//prepare block
			if(block.prepare) {
				allowed = block.prepare.apply(block, args);
				//break loop if false
				return allowed;
			}
		});
		//exit function.
		if(!allowed) { return false; }		
		this.render();
		//Load page
		this._attachAndProcess(container);
		// FIRST TIME |OR| Different page
		//if(!self.currentPage || (self.currentPage && self.currentPage.name != page.name)) {
			this.app._jQChangePage(this);
		//}
		return true;
	},
	reload: function(args){
		args = args || [];
		if(!$.isArray(args)) {
			console.log('Arguments must be array',args);
			throw('Arguments must be array');
		}
		if(this.visible) {
			console.log('reloading page ' + this.name);
			return this._load(args, $(this.app.containerEl));
		} else {
			console.log('Unable to reload page ' + this.name + ', as page is not current/visible page');
			return false;
		}
	},
	
	
});/* ######## WIDGET ############# */
jumpui.fragment = jumpui.fragment || {};

jumpui.fragment.ListItem = Backbone.View.extend({
	tagName: 'li',
	attribute: 'name',
	model:undefined,
	render:function(){
		this.$el.html(this.model.get(this.attribute));
	}
});


jumpui.fragment.formItems = {
	'text': jumpui.internal.AbstractView.extend({
		tagName: 'input'
	})
};
jumpui.fragment.Form = jumpui.Fragment.extend({
	model: undefined,
	items: undefined,
	
	ui: {
		form: 'form',
		formItems: 'form .form-items'
	},
	
	init: function(){
		
	},
	_createItem: function(formItem, parentEl){
		var wrap = $('<div>').attr('data-role', 'fieldcontain');
		
		wrap.append($('<label>').attr('for',formItem.attr).text(formItem.label));
		var inputView = new jumpui.fragment.formItems[formItem.type]({attributes: {type: formItem.type, name: formItem.attr, id: formItem.attr}});
		inputView.render();
		
		if(this.ui.formItems != undefined){
			wrap.append(this.ui.formItems);
		}else{
			wrap.append(inputView.$el);
		}
		//parentEl.append(wrap);
		return wrap;
	},
	getContainer: function(){
		if(this.ui.form == null || this.ui.form == undefined){
			this.ui.form = $("<form>");
			this.ui.form.attr('data-inset',this.options.inset);
		}
		
		return this.ui.formItems;
	},
	render:function(){
		var el = this.getContainer();
		var self = this;
		_.each(this.items, function(formItem) {
			var itemView = self._createItem(formItem, el);
			el.append(itemView)
		});
		
		
		
		this.$el.append(el);
	}
});

jumpui.fragment.List = jumpui.Fragment.extend({
	collection:undefined,
	ItemView: undefined,
	options: {
		inset: true
	},
	init: function(){
		_.bindAll(this, 'refresh');
		if(this.collection===undefined) {
			throw('Collection is null');
		}
		this.collection.on('reset', this.refresh);
		this.collection.on('add', this.refresh);
		this.collection.on('remove', this.refresh);
	},
	refresh: function(){
		this.render();
		this.$("ul").listview();
	},
	getModel:function(){
		return {list: this.collection.toJSON()};
	},
	getContainer: function(){
		var el = $("<ul></ul>");
		el.attr('data-role','listview');
		el.attr('data-inset',this.options.inset);
		return el;
	},
	render: function(){
		this.$el.empty();
		var container = this.getContainer();
		var self = this;
		this.collection.each(function(item){
			var itemView = new self.ItemView({model: item});
			itemView.render();
			container.append(itemView.$el);
		});
		this.$el.append(container);
	}
});