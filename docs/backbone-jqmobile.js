window.jumpui = {};
/*
 * App class
 */
jumpui.JqmApp = Backbone.Model.extend({
	initialize:function() {
		if(this.platform==undefined) {
			throw("containerEl is not defined.");
		}
		if(this.containerEl==undefined) {
			throw("containerEl is not defined.");
		}
		this.platform.setup();
	},
	currentPage:undefined,
	pages:{},	
	load: function() {
		if(this.pages==undefined || this.pages.length<=0) {
			throw("No pages found in app");
		}
		this.goto(this.pages[0].hash)
	},
	addPage:function(hash, page) {
		pages[hash] = page;
	},
	goto:function(pageHash) {
		if(pages[pageHash]==undefined) {
			//throw error
			return;
		}
		var page = pages[pageHash];
		if(!page.isLoaded()) {
			page.load();
		}
		this._changePage(page);
	},
	_changePage:function(page) {
		$.mobile.changePage(page.el);
	},
	_loadPage:function(page) {
		page.load();
		// if(this.currentPage!=undefined) {
		// 	
		// }
		$(this.containerEl).append(page.el);
	}
});


/* ######## PLATFORM ############# */
/*
 * Platform class Web,Cordova
 */
jumpui.platform = Backbone.Model.extend({
	setup:function(){
		
	}
});

jumpui.platform.Cordova = new jumpui.platform({
	setup:function(){
		$.mobile.ajaxEnabled = false;
	    $.mobile.linkBindingEnabled = false;
	    $.mobile.hashListeningEnabled = false;
	    $.mobile.pushStateEnabled = false;
	}
});

jumpui.platform.Web = new jumpui.platform({
	
});

/* ######## MODELS ############# */
jumpui.model = {};
jumpui.m = {};

jumpui.model.Text = Backbone.Model.extend({
	initialize:function(text) {
		if(text) {
			this.set('text', text);
		}
	}
});

_.each(jumpui.model, function(value, name) {
	jumpui.m[name] = value; 
});

/* ######## PAGES ############# */
jumpui.Page = Backbone.View.extend({
	tagName: "div",
	className: "jump-page",
	attributes: {
		data-role: "page"
	},
	initialize:function(){
		
	},
	isLoaded:false,
	load:function() {
		
	}
});

/* ######## BLOCKS ############# */
/*
* Parent View class
*/
jumpui.block = {};
jumpui.b = {};

jumpui.Block = Backbone.View.extend({
	tagName: "div",
});

jumpui.block.Header = jumpui.block.Block.extend({
	className: "jump-header",
	attributes: {
		data-role: "header"
	},
	render:function(){
		
	}
});

jumpui.block.Footer = jumpui.block.Block.extend({
	className: "jump-footer",
	attributes: {
		data-role: "footer"
	},
	render:function(){
		
	}
});

_.each(jumpui.block, function(value, name) {
	jumpui.b[name] = value; 
});

/* ######## WIDGETS ############# */
jumpui.widget = {};
jumpui.w = {};

jumpui.Widget = Backbone.View.extend({
	
});

_.each(jumpui.widget, function(value, name) {
	jumpui.w[name] = value; 
});