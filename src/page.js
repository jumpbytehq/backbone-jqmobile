/* ######## PAGE ############# */
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
		if(options.prepare==undefined) {
			throw ("prepare property is compulsory");
		}
		_.extend(this,options);
		this.id=options.name;
		this.loaded=false;
		if(this.route == undefined) {
			this.route = this.name;
		}
		this.setBlocks(options.blocks || {});
	},
	setBlocks:function(blocks) {
		var self =this;
		//_.extend(this.blocks, blocks);
		this.blocks = blocks;
		_.each(this.blocks, function(block) { block.page = self; });		
	},
	isLoaded:function(){
		return false;
		//return this.loaded;
	},
	load:function(container) {
		container.append(this.el);
		$(this.el).page();
		// $(this.el).trigger('create');
		this.loaded=true;
	},
	// remove:function() {
	// 		$(this.el).remove();
	// 		this.loaded=false;
	// },
	_createDom: function() {
		var self = this;
		//NOTE: $(self.el).remove(); GETS REMOVED when page transition complete, so not removing here. 
		this.setElement(this.make(this.tagName, this.attributes));
		_.each(_.keys(this.blocks), function(blockKey) {
			var block = self.blocks[blockKey];
			if(block.model==undefined) {
				block.model = {};
			}
			_.extend(block.model, block.page.model);
			//_.extend(block.page.model, block.model);
			block.render();
			//console.log(self.name + ": EL: ", block.el);
			$(self.el).append(block.el);
		});
	},
	render: function() {
		console.log('Rendering ' + this.name, this);
		this._createDom();
		$(this.el).trigger('jui-pagerendered');
	}
});