window.jumpui = {};

/*
 * App class
 */
jumpui.JqmApp = Backbone.Model.extend({
	initialize:function() {
		if(this.attributes.platform==undefined) {
			throw "Platform is not specified for this app";
			return;
		}
		if(this.attributes.containerEl==undefined) {
			throw "containerEl is not specified for this app";
			return;
		}
		this.platform = this.attributes.platform;
		this.containerEl = this.attributes.containerEl;
		this.platform.setup();
	},
	currentPage:undefined,
	pages:{},
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
	_changePage:function(page) {
		$.mobile.changePage();
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