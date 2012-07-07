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
/* ######## PLATFORM END ############# */