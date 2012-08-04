/* ######## BLOCK ############# */
jumpui.block = {};
jumpui.Block = jumpui.internal.AbstractView.extend({
	tagName: "div",
	fragments:{},
	initialize:function(){
		jumpui.internal.AbstractView.prototype.initialize.apply(this, arguments);
		var self=this;
		_.each(this.fragments,function(fragment) {
			fragment.block = self;
		});
	},
	render:function(){
		$(this.el).remove();
		this.setElement(this.make(this.tagName, this.attributes));
		var $el = $(this.el);
		if(this.template) {
			//FRAGMENT Processing
			var self = this;
			var renderedFragments={};
			if($.isFunction(this.template)) {
				$el.append(this.page.app.templateEngine.parseHtml(this.template(), this.model, renderedFragments));			
			} else if(this.template!=undefined) {
				$el.append(this.page.app.templateEngine.parse(this.template, this.model, renderedFragments));			
			}

			_.each(this.fragments, function(fragment,key){
				fragment._setEl(self.$('[data-fragment='+key+']'));
				fragment.render(); 
			});
			return;
		}
		if(this.getContent!=null) {
			//$(this.el).empty().append($(this.getContent()));
			$(this.el).empty().append($(this.getContent()));
		} else {
			throw('Neither template nor getContent method found');
		}
	}
});

jumpui.block.Header = jumpui.Block.extend({
	className: "jump-header",
	attributes: {
		'data-role': "header"
	}
});

jumpui.block.Footer = jumpui.Block.extend({
	className: "jump-footer",
	attributes: {
		'data-role': "footer"
	}
});

jumpui.block.Content = jumpui.Block.extend({
	className: "jump-content",
	attributes: {
		'data-role': "content"
	}
});