window.jumpui = {};
/*
 * App class
 */
jumpui.JqmApp = Backbone.Model.extend({
	initialize:function() {
		if(this.platform==undefined) {
			//throw error;
			return;
		}
		this.platform.setup();
	},
	currentPage:undefined,
	pages:{}
	addPage:function(hash, page) {
		pages[hash] = page;
	},
	goto:function(pageHash) {
		if(pages[pageHash]==undefined) {
			//throw error
			return;
		}
		var page = pages[pageHash];
		this._changePage(page);
	},
	_changePage(page) {
		$.mobile.changePage();
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
	
});

/* ######## BLOCKS ############# */
/*
* Parent View class
*/
jumpui.block = {};
jumpui.b = {};

jumpui.Block = Backbone.View.extend({
	
});

jumpui.block.Header = jumpui.block.Block.extend({
	tagName: "div",
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