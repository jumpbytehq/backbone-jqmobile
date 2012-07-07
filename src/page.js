jumpui.Page = Backbone.View.extend({
	tagName: "div",
	className: "jump-page",
	attributes: {
		'data-role': "page"
	},
	//blocks:{},
	initialize:function(options){
		if(options == undefined || options.name==undefined) {
			throw ("name property is compulsory");
		}
		this.name=options.name;
		this.id=options.name;
		this.route=options.name;
		this.prepare = options.prepare;
		this.loaded=false;
		if(options.route) {
			this.route = options.route;
		}
		this.blocks={};
		if(options.blocks) {
			_.extend(this.blocks, options.blocks);
		}
	},
	isLoaded:function(){
		return this.loaded;
	},
	load:function(container) {
		container.append(this.el);
		$(this.el).page();
		this.loaded=true;
	},
	remove:function() {
		//$(this.el).remove();
		//this.loaded=false;
	},
	render: function() {
		console.log('Rendering ' + this.name, this);
		var self = this;
		$(self.el).empty();
		_.each(_.keys(this.blocks), function(blockKey) {
			var block = self.blocks[blockKey];
			block.render();
			console.log(self.name + ": EL: ", block.el);
			$(self.el).append(block.el);
		});
	}
});