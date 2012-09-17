jumpui.fragment = {};
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
});