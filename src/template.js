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
});