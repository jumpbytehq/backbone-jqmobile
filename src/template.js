jumpui.template = {};
jumpui.template.engine = {};
jumpui.Template = Backbone.Model.extend({
	initialize:function(src) {
		this.src = src;
	},
	parse: function(model){
		
	}
});

jumpui.template.engine.UNDERSCORE = new jumpui.Template();