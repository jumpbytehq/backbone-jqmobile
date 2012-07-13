/* ######## APP ############# */
window.jumpui = {};
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
				page.prepare.apply(page, args);
				_.each(page.blocks, function(block){
					//prepare block
					if(block.prepare) { block.prepare.apply(block, args)};
				});
				page.render();
				//Load page
				page.load($(self.containerEl));
				// FIRST TIME |OR| Different page
				//if(!self.currentPage || (self.currentPage && self.currentPage.name != page.name)) {
					self._jQChangePage(page);
				//} 
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
		if(options.rootPage==undefined) {
			this.router.navigate(_.values(this.pages)[0].name);
		} else {
			this.router.navigate(options.rootPage);
		}
	},
	addPage:function(page) {
		page.app = this;
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
/* ######## PLATFORM END ############# */