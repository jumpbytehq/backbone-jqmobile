/* ######## BLOCK ############# */
jumpui.block = {};
jumpui.Block = Backbone.View.extend({
	tagName: "div",
	initialize:function(){
		_.extend(this, this.options);
		if(this.init) {
			this.init();
		}
	},
	render:function(){
		$(this.el).remove();
		this.setElement(this.make(this.tagName, this.attributes));
		var $el = $(this.el);
		if(this.templateKey) {
			$el.append(this.page.app.templateEngine.parse(this.templateKey, this.model));
			return;
		} 
		if(this.getContent!=null) {
			//$(this.el).empty().append($(this.getContent()));
			$(this.el).empty().append($(this.getContent()));
		} else {
			return $(this.el).empty().append("<p>Default Block Content</p>");
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