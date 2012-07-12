/* ######## TEMPLATE ############# */
jumpui.template = {};
jumpui.template.engine = {};
jumpui.Template = Backbone.Model.extend({
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
	initialize:function(options) {
		_.extend(this,options);
		
		//REGISTER HELPERS
		var helpers = this.helpers || {};
		_.each(_.keys(helpers), function(helperKey){
			Handlebars.registerHelper(helperKey, helpers[helperKey]);
		})
	},
	parse:function(templateKey, model) {
		var source   = $("#"+templateKey).html();
		var template = Handlebars.compile(source);
		return template(model);	  
	}
});