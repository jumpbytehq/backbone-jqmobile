jumpApp = {};
$(document).bind("mobileinit", function(){	
	 countryList = new Backbone.Collection();
	countryList.add(new Backbone.Model({name:'India'}));
	
	jumpApp.app = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#appContainer',
		templateEngine: new jumpui.template.engine.Handlebars()
	});
	
	jumpApp.Header = jumpui.block.Header.extend({
		template: "header"
	});
	jumpApp.footer = new jumpui.block.Footer({
		template: "footer"
	});
	
	jumpApp.pages = {
		listPage: new jumpui.Page({
			name: "list",
			route:"",
			blocks: {
				'header':new jumpApp.Header(),
				'content': new jumpui.block.Content({
					events:{
						"click #btn":"open"
					},
					open:function() {
						alert('button clicked');
					},
					template: "list",
					fragments:{
						'menu': new jumpui.Fragment({
							template: 'menu',
							collection:countryList,
							init: function(){
								_.bindAll(this, 'refresh');
								if(this.collection===undefined) {
									throw('Collection is null');
								}
								this.collection.on('reset', this.refresh);
								this.collection.on('add', this.refresh);
								this.collection.on('remove', this.refresh);
							},
							refresh: function(){
								this.render();
								this.$("ul").listview();
							},
							getModel:function(){
								return {source: this.collection.toJSON()};
							}
						})
					},
					renderDone: function(){
						var listWidget = new jumpui.widget.ListWidget({collection: countryList});
						listWidget.render();
						this.$el.append(listWidget.$el);
					}
				}),
				'footer':jumpApp.footer
			},
			prepare:function() {
				this.model={title: "Abcd"};
				return true;
			}
		})
	};
	
	jumpApp.app.addPage(jumpApp.pages.listPage);
});

// $(document).ready(function() {	
$(document).bind("mobileinit", function(){
	setTimeout(function(){
		//$.mobile.changePage("#new");
	    jumpApp.app.load();
 	},1);
});