jumpApp = {};
$(document).bind("mobileinit", function(){
	var ListItem = jumpui.fragment.ListItem.extend({
		events: {
			'click a': 'itemClick'
		},
		template: "listItemTpl",
		itemClick: function(e){
			console.log('item clicked: ', this.model.get('name'));
		}
		// ,
		// render: function(){
		// 			this.$el.empty();
		// 			var el = $("<a>").append($('<span>').html(this.model.get('name')));
		// 			this.$el.append(el);
		// 		}
	})
	Country = Backbone.Model.extend({
		name: undefined,
		ext: -1
	});
	countryList = new Backbone.Collection();
	countryList.add(new Country({name:'India', ext:2}));
	
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
						// 'menu': new jumpui.fragment.List({
						// 							collection:countryList,
						// 							ItemView: ListItem,
						// 							inset: false
						// 						}),
						'form': new jumpui.fragment.Form({
							events: {
								"submit form": 'onSubmit'
							},
							model:Country,
							items: [
								{attr: 'name', type: 'text', label: 'Name', validation:[], value: "dhaval"},
								{attr: 'password', type: 'password', label: 'Password', validation:[], data: {placeholder: "Password here"}},
								{attr: 'ext', type: 'number', label: 'Ext', validation:[], value: 10},
								{attr: 'type', type: 'range', label: 'Range', validation:[], data: {min: 0, max: 100}, value: 10},
								// {attr: 'type', type: 'select', label: 'Type', validation:[]},
 								
							],
							inset: false,
							// action: "submit/here",
							onSubmit: function(){
								console.log("on submit ", this.getValues());
								
							}
						}),
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