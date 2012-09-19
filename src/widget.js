/* ######## WIDGET ############# */
jumpui.fragment = jumpui.fragment || {};

jumpui.fragment.ListItem = Backbone.View.extend({
	tagName: 'li',
	attribute: 'name',
	model:undefined,
	templateEngine: undefined,
	initialize: function(options){
		this.templateEngine = options.templateEngine;
	},
	render:function(){
		if(this.template){
			var modelJson = _.isFunction(this.model.toJSON) ? this.model.toJSON() : this.model;
			if($.isFunction(this.template)) {
				this.$el.html(this.templateEngine.parseHtml(this.template(modelJson), modelJson));
			} else {
				this.$el.html(this.templateEngine.parse(this.template, modelJson));
			}
		}else{
			this.$el.html(this.model.get(this.attribute));
		}
	}
});

jumpui.fragment.formItems = {	
	'text': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "text"
		}
	}),
	'password': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "password"
		}
	}),
	'number': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "number"
		}
	}),
	'submit': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "submit",
			value: "Submit"
		}
	}),
	'reset': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "reset",
			value: "Reset"
		}
	}),
	'range': jumpui.internal.AbstractView.extend({
		tagName: 'input',
		attributes: {
			type: "range",
			"data-highlight": true
		}
	}),
	'select': jumpui.internal.AbstractView.extend({
		tagName: 'select',
		initialize: function(options){
			var self= this;
			if(this.attributes.options){
				_.each(this.attributes.options, function(option){
					var optionEl = $("<option>").attr("value", option).html(option);
					if(self.attributes.value == option){
						optionEl.attr("selected", "selected");
					}
					self.$el.append(optionEl);
				});
			}
		}
	}), 
};

jumpui.fragment.FormFooter = jumpui.internal.AbstractView.extend({
	tagName: "div",
	attributes: {
		"class": "ui-body" 
	},
	render: function(){
		var wrap = $("<fieldset>").attr("class", "ui-grid-a");
		
		var submitBtn = $("<div>").addClass("ui-block-a").append(new jumpui.fragment.formItems.submit().$el);
		var resetBtn = $("<div>").addClass("ui-block-b").append(new jumpui.fragment.formItems.reset().$el);
		
		wrap.append(submitBtn);
		wrap.append(resetBtn);
		
		this.$el.append(wrap);
		return this.$el;
	}
});

jumpui.fragment.Form = jumpui.Fragment.extend({
	model: undefined,
	items: undefined,
	itemsEl: [],
	
	events : {
		"submit form": "submit"
	},
	
	init: function(){
		var self = this;
		
		this.options = _.defaults({action: "javascript:;"})
		this.model.on("error", function(model, error){
			self.errorEl.html(error);
			self.errorEl.show();
		});
	},
	_createItem: function(formItem, parentEl){
		var wrap = $('<div>').attr('data-role', 'fieldcontain');

		wrap.append($('<label>').attr('for',formItem.name).text(formItem.label));
		formItem.value = this.model.get(formItem.name);
		formItem.id = formItem.name;
		var inputView = new jumpui.fragment.formItems[formItem.type]({attributes: _.extend(formItem, formItem.data || {})});
		this.itemsEl.push(inputView);
		inputView.$el.bind("change", function(){		
		});
		
		inputView.render();		
		wrap.append(inputView.$el);
		return wrap;
	},
	getContainer: function(){
		this.errorEl = $("<div class='error'>this is error</div>");
		this.$el.append(this.errorEl);
		
		var form = $("<form></form>").attr("action", this.options.action);
		return form;
	},
	render:function(){
		var el = this.getContainer();
		var self = this;
		_.each(this.items, function(formItem) {
			var itemView = self._createItem(formItem, el);
			el.append(itemView)
		});
		
		el.append(new jumpui.fragment.FormFooter().render());
		this.$el.append(el);
	},
	getValues: function(){
		return jumpui.util.serializeForm(this.$el);
	},
	submit: function(){
		this.errorEl.hide();
		var values = this.getValues();
		if(this.model.set(values)){
			if(this.onSubmit) this.onSubmit();
		}	
	}
});

jumpui.fragment.List = jumpui.Fragment.extend({
	collection:undefined,
	ItemView: undefined,
	options: {
		inset: false
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
		this.$("ul").listview();
	},
	getModel:function(){
		return {list: this.collection.toJSON()};
	},
	getContainer: function(){
		var el = $("<ul></ul>");
		el.attr('data-role','listview');
		el.attr('data-inset',this.options.inset);
		return el;
	},
	render: function(){
		this.$el.empty();
		var container = this.getContainer();
		var self = this;
		
		var templateEngine = this.block.page.app.templateEngine;
		
		this.collection.each(function(item){
			var itemView = new self.ItemView({model: item, templateEngine: templateEngine});
			itemView.render();
			container.append(itemView.$el);
		});
		this.$el.append(container);
	}
});