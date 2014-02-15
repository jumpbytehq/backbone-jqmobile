/* ####### SET JQUERY MOBILE DEFAULTS ######## */
$(document).bind("mobileinit", function(){
	console.log('setting Jquery mobile on mobile init');
 	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
});

/* ######## APP ############# */
window.jumpui = window.jumpui || {};
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
		$(this.containerEl).on('pageshow', function(event, ui) {
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
	initialize:function(opts){
		_.extend(this, opts);
		
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
