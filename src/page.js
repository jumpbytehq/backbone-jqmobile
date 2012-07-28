/* ######## PAGE ############# */
jumpui.Page = Backbone.View.extend({
	tagName: "div",
	className: "jump-page",
	attributes: {
		'data-role': "page"
	},
	//blocks:{},
	initialize:function(options){
		_.bindAll(this, 'reload');
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
		if(this.init) {
			this.init();
		}
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
	_attachAndProcess:function(container) {
		container.append(this.el);
		$(this.el).page();
		// $(this.el).trigger('create');
		this.loaded=true;
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
	},
	_load:function(args, container){
		//prepare page
		var allowed = false;
		allowed = this.prepare.apply(this, args);
		//exit function
		if(!allowed) { return; }
		_.every(this.blocks, function(block){
			//prepare block
			if(block.prepare) {
				allowed = block.prepare.apply(block, args);
				//break loop if false
				return allowed;
			}
		});
		//exit function.
		if(!allowed) { return false; }		
		this.render();
		//Load page
		this._attachAndProcess(container);
		// FIRST TIME |OR| Different page
		//if(!self.currentPage || (self.currentPage && self.currentPage.name != page.name)) {
			this.app._jQChangePage(this);
		//}
		return true;
	},
	reload: function(args){
		args = args || [];
		if(!$.isArray(args)) {
			console.log('Arguments must be array',args);
			throw('Arguments must be array');
		}
		if(this.visible) {
			console.log('reloading page ' + this.name);
			return this._load(args, $(this.app.containerEl));
		} else {
			console.log('Unable to reload page ' + this.name + ', as page is not current/visible page');
			return false;
		}
	}
});