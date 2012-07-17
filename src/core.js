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
				var allowed = false;
				allowed = page.prepare.apply(page, args);
				//exit function
				if(!allowed) { return; }
				_.each(page.blocks, function(block){
					//prepare block
					if(block.prepare) {
						allowed = block.prepare.apply(block, args);
						//break loop
						if(!allowed) { return; }
					};
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
		this.pages[page.name] = page;
		if(this.theme) {
			page.attributes['data-theme'] = this.theme;
		}
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