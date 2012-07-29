/* ######## TEMPLATE ############# */
jumpui.template = {};
jumpui.template.engine = {};
jumpui.TemplateEngine = Backbone.Model.extend({
	parse: function(templateKey, model){
		return templateKey;
	}
});

jumpui.template.engine.Underscore = jumpui.TemplateEngine.extend({
	parse:function(templateKey, model) {
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
	parse:function(templateKey, model, fragments) {
		var source   = $("#"+templateKey).html();
		var template = Handlebars.compile(source);
		model.fragments = fragments;
		return template(model);	  
	},
	registerPartial: function(partialKey){
		Handlebars.registerPartial(partialKey, $("#"+partialKey).html());
	}
});