/* ######## WIDGET ############# */
jumpui.fragment = jumpui.fragment || {};

jumpui.fragment.ListItem = Backbone.View.extend({
	tagName: 'li',
	attribute: 'name',
	model:undefined,
	render:function(){
		this.$el.html(this.model.get(this.attribute));
	}
});


jumpui.fragment.formItems = {
	'text': jumpui.internal.AbstractView.extend({
		tagName: 'input'
	})
};
jumpui.fragment.Form = jumpui.Fragment.extend({
	model: undefined,
	items: undefined,
	
	ui: {
		form: 'form',
		formItems: 'form .form-items'
	},
	
	init: function(){
		
	},
	_createItem: function(formItem, parentEl){
		var wrap = $('<div>').attr('data-role', 'fieldcontain');
		
		wrap.append($('<label>').attr('for',formItem.attr).text(formItem.label));
		var inputView = new jumpui.fragment.formItems[formItem.type]({attributes: {type: formItem.type, name: formItem.attr, id: formItem.attr}});
		inputView.render();
		
		if(this.ui.formItems != undefined){
			wrap.append(this.ui.formItems);
		}else{
			wrap.append(inputView.$el);
		}
		//parentEl.append(wrap);
		return wrap;
	},
	getContainer: function(){
		if(this.ui.form == null || this.ui.form == undefined){
			this.ui.form = $("<form>");
			this.ui.form.attr('data-inset',this.options.inset);
		}
		
		return this.ui.formItems;
	},
	render:function(){
		var el = this.getContainer();
		var self = this;
		_.each(this.items, function(formItem) {
			var itemView = self._createItem(formItem, el);
			el.append(itemView)
		});
		
		
		
		this.$el.append(el);
	}
});

jumpui.fragment.List = jumpui.Fragment.extend({
	collection:undefined,
	ItemView: undefined,
	options: {
		inset: true
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
		this.collection.each(function(item){
			var itemView = new self.ItemView({model: item});
			itemView.render();
			container.append(itemView.$el);
		});
		this.$el.append(container);
	}
});