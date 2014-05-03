/* ######## WIDGET ############# */
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