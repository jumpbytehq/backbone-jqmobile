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
		this.platform = this.attributes.platform;
		this.containerEl = this.attributes.containerEl;
		this.platform.setup();
	},
	currentPage:undefined,
	pages:{},
	load: function() {
		if(this.pages.length<=0) {
			throw("No pages found in app");
		}
		this.goto(_.keys(this.pages)[0]);
	},
	addPage:function(page) {
		this.pages[page.name] = page;
	},
	goto:function(pageNameOrPage) {
		if(pageNameOrPage==undefined) {
			throw("pageName not defined");
		}
		if($(this.containerEl).length<=0) {
			throw('containerEl is not available in DOM. containerEl: ' + this.containerEl);
		}

		var page = undefined;
		if(_.isObject(pageNameOrPage)) {
			page = pageNameOrPage;
		} else {
			page = this.pages[pageNameOrPage];
		}
		
		if(!page.isLoaded()) {
	 		page.load($(this.containerEl));
	 	}
		this._jQChangePage(page);
	},
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
/* ######## PLATFORM END ############# */

/* ######## PAGES ############# */
jumpui.Page = Backbone.View.extend({
	tagName: "div",
	className: "jump-page",
	id:"test2",
	attributes: {
		'data-role': "page"
	},
	initialize:function(name){
		this.name=name;
		this.id=name;
	},
	isLoaded:function(){
		return false;
	},
	blocks:[],
	load:function(container) {
		this.render();
		container.append(this.el);
		$(this.el).page();
	},
	render: function() {
		console.log('Rendering ' + this.name, this);
		$(this.el).append($('<h3>page z</h3>'));
		_.each(this.blocks, function(block) {
			this.$(this.el).append(block);
		});
	}
});
/* ######## PAGES END ############# */

/* ######## BLOCKS ############# */
jumpui.block = {};
jumpui.b = {};

jumpui.Block = Backbone.View.extend({
	tagName: "div",
});

jumpui.block.Header = jumpui.Block.extend({
	className: "jump-header",
	attributes: {
		'data-role': "header"
	},
	render:function(){
		
	}
});

jumpui.block.Footer = jumpui.Block.extend({
	className: "jump-footer",
	attributes: {
		'data-role': "footer"
	},
	render:function(){
		
	}
});

jumpui.block.Content = jumpui.Block.extend({
	className: "jump-content",
	attributes: {
		'data-role': "content"
	},
	render:function(){
		
	}
});

_.each(jumpui.block, function(value, name) {
	jumpui.b[name] = value; 
});
/* ######## BLOCKS END ############# */