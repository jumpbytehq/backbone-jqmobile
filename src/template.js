jumpui.template = {};
jumpui.template.engine = {};
jumpui.Template = Backbone.Model.extend({
	initialize:function(src) {
		this.src = src;
	},
	parse: function(templateKey, model){
		return templateKey;
	}
});

jumpui.template.engine.Underscore = jumpui.Template.extend({
	parse:function(templateKey, model) {
		throw("UNDERSCORE not implemented yet");
	}
});
jumpui.template.engine.Handlebars = jumpui.Template.extend({
	parse:function(templateKey, model) {
		var source   = $("#"+templateKey).html();
		var template = Handlebars.compile(source);
		return template(model);	  
	}
});