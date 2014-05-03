/* ######## UTIL ############# */

window.jumpui = window.jumpui || {};
jumpui.util = jumpui.util || {};

jumpui.util.serializeForm = function($el) {
    if ( $el == undefined || !$el.length ) { 
		throw "No elements found in the form";
	}

    var data = {},
      lookup = data; //current reference of data

      $el.find(':input[type!="checkbox"][type!="radio"], input:checked').each(function() {
        // data[a][b] becomes [ data, a, b ]
        var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(','),
            cap = named.length - 1,
            i = 0;

        // Ensure that only elements with valid `name` properties will be serialized
        if ( named[ 0 ] ) {
          for ( ; i < cap; i++ ) {
              // move down the tree - create objects or array if necessary
              lookup = lookup[ named[i] ] = lookup[ named[i] ] ||
                  ( named[i+1] == "" ? [] : {} );
          }

          // at the end, psuh or assign the value
          if ( lookup.length != undefined ) {
               lookup.push( $(this).val() );
          }else {
				if(lookup[ named[ cap ] ]){
					if(_.isArray(lookup[named[cap]])){
						lookup[named[cap]].push( $(this).val());
					}else{
						lookup[named[ cap ]] = [lookup[ named[ cap ]], $(this).val()];
					}
				}else{
					if($(this).attr("data-field") == "array"){
						lookup[ named[ cap ] ]  = [$(this).val()];
					}else{
                		lookup[ named[ cap ] ]  = $(this).val();
					}
				}
          }

          // assign the reference back to root
          lookup = data;

        }
      });

    return data;
};

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
			this.$el.append(this.block.page.app.templateEngine.parseHtml(this.template(this.getModel()), this.getModel()));
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
		this.setElement(jQuery(document.createElement(this.tagName)).attr(this.attributes));
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
	        var self = this;
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
		this.el.className = this.className + " " + this.name + "-page";
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
		this.setElement(jQuery(document.createElement(this.tagName)).attr(this.attributes));
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
		if(window.localStorage) {
			var currentPage = localStorage.getItem("jqmobile_current_page");
			localStorage.setItem("jqmobile_prev_page", currentPage);
		    localStorage.setItem("jqmobile_current_page", location.hash);
			sessionStorage.setItem("jqmobile_navigation_time", new Date().getTime());
		}
		
		// Check for global page load method
		if(this.app.beforePageLoad){
			var allowed = this.app.beforePageLoad(this);
			if(!allowed){
				return false;
			}
		}

		//prepare page
		var allowed = false;
		allowed = this.prepare.apply(this, args);
		//exit function
		if(!allowed) { return; }
		_.each(this.blocks, function(block){
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

jumpui.fragment.Validators = {
	messages: {
		required: "Value is required",
		match: "Value is not matching",
		email: "Invalid email",
		equals: "Not equal to"
	},
	
	required: function(val, param){
		if(_.isEmpty(val) || _.isEmpty(val.trim())){
			return param.message || jumpui.fragment.Validators.messages.required;
		}
	},
	
	match: function(val, param){
		var paramVal = $("[name="+param+"]").val();
		if(!_.isEqual(val, paramVal)){
			return param.message || jumpui.fragment.Validators.messages.match;
		}
	},
	
	email: function(val){
		if(!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(val)) return jumpui.fragment.Validators.messages.email;
	},
	
	equals: function(val, expr){
		var regEx = new RegExp(expr, "g");
		if(!regEx.test(val)) return jumpui.fragment.Validators.messages.equals + " " + expr;
	}
}
jumpui.fragment.AbstractFormItem = jumpui.internal.AbstractView.extend({
	validate: function(value){
		if(_.isEmpty(this.validations)){
			return;
		}
		
		var self = this;
		for(i=0;i<this.validations.length;i++){
			var validate = this.validations[i];
			
			var param = undefined;
			var key = undefined;
			
			if(_.isString(validate)){
				key = validate;
				param = true;
			}else{
				key = _.keys(validate)[0];
				param = validate[key];
			} 
			
			if(jumpui.fragment.Validators[key]){
				var result = jumpui.fragment.Validators[key]( value, param);
				if(result){
					self.$el.addClass('invalid');
					return result;
				}else{
					self.$el.removeClass('invalid');
				}
			}
		}
	}
});

jumpui.fragment.formItems = {	
	'text': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'password': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'email': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'date': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'number': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'tel': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	'submit': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "submit"			
		},
		initialize: function(options){
			if(options.show === false){
				this.$el.hide();
			}
			this.$el.attr("value", options.value);
			if(options.extra){
				this.$el.attr(options.extra);
			}
		}
	}),
	'reset': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "reset"
		},
		initialize: function(options){
			if(options.show === false){
				this.$el.hide();
			}
			this.$el.attr("value", options.value);
		}
	}),
	'range': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input',
		attributes: {
			type: "range",
			"data-highlight": true
		}
	}),
	'select': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'select',
		initialize: function(options){
			_.bindAll(this, 'render');
			
			var self= this;
			if(this.attributes && this.attributes.options){
				_.each(this.attributes.options, function(option){
					var optionEl = $("<option>").attr("value", option).html(option);
					if(self.attributes.value == option){
						optionEl.attr("selected", "selected");
					}
					self.$el.append(optionEl);
				});
			}else if(this.attributes && this.attributes.collection){
				this.collection = this.attributes.collection;
				this.collectionKey = this.attributes.collectionKey;
				this.collectionValue = this.attributes.collectionValue;
				
				this.collection.on('reset', this.render);
				this.collection.on('add', this.render);
				this.collection.on('remove', this.render);
			}
		},
		render: function(){
			this.$el.empty();
			var self = this;
			
			this.collection.each(function(option){
				var optionEl = $("<option>").attr("value", option.get(self.collectionKey) ).html(option.get(self.collectionValue));
				if(self.attributes.value == option.get(self.collectionKey)){
					optionEl.attr("selected", "selected");
				}
				self.$el.append(optionEl);
			});
			_.delay(function(){
				self.$el.selectmenu('refresh', true);
			}, 100);
		}
	}), 
	'div': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'div',
	}),	
	'radiogroup': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'fieldset',
		attributes: {
			"data-role": "controlgroup"
		},
		initialize: function(options){
			var self= this;
			if(this.attributes.options){
				_.each(this.attributes.options, function(option){
					var optionEl = $("<input>").attr({"type": "radio", "value": option, name: self.attributes.name, id: option}).html(option);
					var labelEl = $("<label>").attr("for", option).html(option);
					if(self.attributes.value == option){
						optionEl.attr("checked", "checked");
					}
					self.$el.append(optionEl);
					self.$el.append(labelEl);
				});
			}
		}
	}),
	
	'checkboxgroup': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'fieldset',
		attributes: {
			"data-role": "controlgroup"
		},
		initialize: function(options){
			var self= this;
			if(this.attributes.options){
				_.each(this.attributes.options, function(option){
					var optionEl = $("<input>").attr({"type": "checkbox", "value": option, name: self.attributes.name, id: option, "data-field": "array"}).html(option);
					var labelEl = $("<label>").attr("for", option).html(option);
					if(_.contains(self.attributes.value, option)){
						optionEl.attr("checked", "checked");
					}
					self.$el.append(optionEl);
					self.$el.append(labelEl);
				});
			}
			
			this.$el.bind("change", function(e){
				var selected = $(e.target).val();
				if(!$(e.target).attr("checked")){
					self.model.set( self.attributes.name, _.difference(self.model.get(self.attributes.name), selected), {silent: true});
				}
			});
		}
	}),
	
	'checkbox': jumpui.fragment.AbstractFormItem.extend({
		tagName: 'input'
	}),
	
	'textarea': jumpui.internal.AbstractView.extend({
		tagName: 'textarea',
		validate: function(){
			return;
		}
	}),
};

jumpui.fragment.FormFooter = jumpui.internal.AbstractView.extend({
	tagName: "div",
	attributes: {
		
	},
	initialize: function(submitButton, resetButton){
		this.submit = submitButton;
		this.reset = resetButton;
	},
	render: function(){
		var wrap = undefined;
		var grid = true;
		
		if(this.submit.show && this.reset.show){
			wrap = $("<fieldset>").attr("class", "ui-grid-a");
		}else{
			wrap = $("<div>");
			grid = false;
		}
		
		if(this.submit.show){
			if(grid){
				var submitBtn = $("<div>").addClass("ui-block-a").append(new jumpui.fragment.formItems.submit({value: this.submit.label, extra: this.submit.extra || {} }).$el);
			}else{
				var submitBtn = new jumpui.fragment.formItems.submit({value: this.submit.label, extra: this.submit.extra || {} }).$el;
			}
			wrap.append(submitBtn);
		}
		
		if(this.reset.show){
			if(grid){
				var resetBtn = $("<div>").addClass("ui-block-b").append(new jumpui.fragment.formItems.reset({value: this.reset.label}).$el);
			}else{
				var resetBtn = new jumpui.fragment.formItems.reset({value: this.reset.label}).$el;
			}
			wrap.append(resetBtn);
		}
		
		this.$el.append(wrap);
		return this.$el;
	}
});

jumpui.fragment.Form = jumpui.Fragment.extend({
	model: undefined,
	items: undefined,
	submitButton: {
		show: true,
		label: "Submit",
	},
	resetButton: {
		show: true,
		label: "Cancel"
	},
	formFooter: jumpui.fragment.FormFooter,
	events : {
		"submit form": "submit"
	},
	
	init: function(){
		var self = this;
		this.itemsEl = [];
		this.options = _.defaults({action: "javascript:;"})
		this.model.on("error", function(model, error){
			if(self.errorEl){
				self.errorEl.html(error);
				self.errorEl.show();
			}
		});
	},
	_createItem: function(formItem, parentEl){
		var wrap;
		
		formItem.value = this.model.get(formItem.name);
		formItem.id = formItem.name;
		
		if(this.template){
			var placeholder = parentEl.find("[data-placeholder="+ formItem.name +"]");
			
			if(formItem.readonly){
				placeholder.append($('<label>').attr('name',formItem.name).text(formItem.value));
			}else{
				var elementAttrs = _.extend(formItem, formItem.data || {});	
				var inputView = new jumpui.fragment.formItems[formItem.type]({
					attributes: _.extend( elementAttrs, jumpui.fragment.formItems[formItem.type].prototype.attributes) ,
					model: this.model,
					validations: formItem.validations,
					name: formItem.name
				});
				this.itemsEl.push(inputView);
				inputView.render();		
				placeholder.append(inputView.$el);
			}
			
			wrap = placeholder;
		}else{
			if(formItem.type != "div"){
				wrap = $('<div>').attr('data-role', 'fieldcontain').attr('class', formItem["class"] || "");

				wrap.append($('<label>').attr('for',formItem.name).text(formItem.label));
				
				var elementAttrs = _.extend(formItem, formItem.data || {});	
				var inputView = new jumpui.fragment.formItems[formItem.type]({
					attributes: _.extend( elementAttrs, jumpui.fragment.formItems[formItem.type].prototype.attributes) ,
					model: this.model,
					validations: formItem.validations,
					name: formItem.name
				});
		
				this.itemsEl.push(inputView);
				inputView.$el.bind("change", function(){		
				});
	
				inputView.render();		
				wrap.append(inputView.$el);
			}else{
				wrap = new jumpui.fragment.formItems[formItem.type]({
					attributes: _.extend( formItem, jumpui.fragment.formItems[formItem.type].prototype.attributes) ,
					model: this.model,
					validations: formItem.validations,
					name: formItem.name
				});
				wrap.render();
				wrap = wrap.$el;
			}
		}
		
		return wrap;
	},
	getContainer: function(){
		this.errorEl = $("<div class='error'>this is error</div>");
		this.$el.append(this.errorEl);
		
		var form = $("<form></form>").attr("action", this.options.action).attr("autocomplete", "off").attr("autocapitalize", "off");
		return form;
	},
	render:function(){
		var el = this.getContainer();
		var self = this;
		
		if(this.template){
			if($.isFunction(this.template)) {
				el.append( this.block.page.app.templateEngine.parseHtml( this.template({}), {}) );
			} else {
				el.append( this.block.page.app.templateEngine.parse( this.template, {}) );
			}
			
		}
		
		_.each(this.items, function(formItem) {
			var itemView = self._createItem(formItem, el);
			if(!self.template){
				el.append(itemView)
			}
		});
		
		el.append( new this.formFooter(this.submitButton, this.resetButton).render() );
		this.$el.append(el);
	},
	getValues: function(){
		return jumpui.util.serializeForm(this.$el);
	},
	submit: function(){
		var invalidItems = this.validate();
		if(!_.isEmpty(invalidItems)){
			return;
		}
		
		var values = this.getValues();
		if(this.model.set(values)){
			if(this.onSubmit){
				this.onSubmit();
			}else if(this.block.page.onSubmit){
				this.block.page.onSubmit();
			}
		}	
	},
	validate: function(){
		var self = this;
		this.invalidItems = {};
		
		var values = this.getValues();
		_.each(this.itemsEl, function(item){
			var result = item.validate(values[item.name]);
			if(result){
				self.invalidItems[item.name] = result;
			}
		});
		
		return this.invalidItems;
	},
	saveValues: function(){
		var invalidItems = this.validate();
		if(!_.isEmpty(invalidItems)){
			return false;
		}
		
		var values = this.getValues();
		return this.model.set(values);
	}
});

jumpui.fragment.EmptyView = Backbone.View.extend({
	tagName: 'div',
	attribute: 'name',
	model:undefined,
	templateEngine: undefined,
	initialize: function(options){
		if(options){
			this.templateEngine = options.templateEngine;
		}
	},
	getModel: function(){
		return this.model || {};
	},
	render:function(){
		if(!this.templateEngine){
			this.templateEngine = this.block.page.app.templateEngine;
		}
		if(this.template){
			var modelJson = _.isFunction(this.getModel().toJSON) ? this.getModel().toJSON() : this.getModel();
			if($.isFunction(this.template)) {
				this.$el.html(this.templateEngine.parseHtml(this.template(modelJson), modelJson));
			} else {
				this.$el.html(this.templateEngine.parse(this.template, modelJson));
			}
		}else{
			if(_.isFunction(this.getModel().toJSON)){
				this.$el.html(this.getModel().get(this.attribute));
			}else{
				this.$el.html(this.getModel());
			}
		}
	}
});

jumpui.fragment.List = jumpui.Fragment.extend({
	collection:undefined,
	ItemView: undefined,
	EmptyView: undefined,
	options: {
		inset: false,
		filter: false,
		divider: false,
		splitbutton: false,
		splitbutton_icon: "",
		splitbutton_theme: "d",
		theme: "a"
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
		if(this.collection.length > 0){
			this.$("ul").listview();
		}
	},
	getModel:function(){
		return {list: this.collection.toJSON()};
	},
	getContainer: function(){
		var el = $("<ul></ul>");
		el.attr('data-role','listview');
		el.attr('data-inset',this.options.inset);
		el.attr('data-filter', this.options.filter);
		el.attr('data-autodividers', this.options.divider);
		el.attr('data-theme', this.options.theme);

		if(this.options.splitbutton){
			el.attr('data-split-icon', this.options.splitbutton_icon);
			el.attr("data-split-theme", this.options.splitbutton_theme);
			//data-split-icon="gear" data-split-theme="d"
		}
		return el;
	},
	getEmptyContainer: function(){
		var el = $("<div></div>");
		return el;
	},
	render: function(){
		this.$el.empty();
		var container;
		var self = this;
		
		var templateEngine = this.block.page.app.templateEngine;
		
		if(this.collection.length > 0){
			container = this.getContainer();
			this.collection.each(function(item){
				var itemView = new self.ItemView({model: item, templateEngine: templateEngine});
				itemView.render();
				container.append(itemView.$el);
			});
		}else if(this.EmptyView){
			container = this.getEmptyContainer();
			var emptyView;
			if(this.EmptyView instanceof jumpui.fragment.EmptyView){
				emptyView = this.EmptyView;
			}else{
				var modelJson = this.block.page.model;
				emptyView = new this.EmptyView({model: modelJson || {}, templateEngine: templateEngine});
			}
			emptyView.render();
			container.append(emptyView.$el);
		}
		
		this.$el.append(container);
	}
});