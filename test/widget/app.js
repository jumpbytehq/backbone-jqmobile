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
		ext: -1,
		password: "",
		range: 0,
		select: "",
		
		defaults: {
			range: 10,
			password: "test",
			select: "one"
		},
		
		validate: function(attrs){
			if(attrs.password.length <= 3){
				return "Password too short";
			}else if(attrs.range <= 20){
				return "Range is too small";
			}else if(attrs.select == ""){
				return "Please select a value";
			}
		}
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
							model:countryList.at(0),
							items: [
								{name: 'name', type: 'text', label: 'Name'},
								{name: 'password', type: 'password', label: 'Password', data: {placeholder: "Password here"}},
								{name: 'ext', type: 'number', label: 'Ext'},
								{name: 'range', type: 'range', label: 'Range', data: {min: 0, max: 100}},
								{name: 'select', type: 'select', label: 'Select', options: ["", "one", "two"]},
							],
							inset: false,
							// action: "submit/here",
							onSubmit: function(){
								console.log("on submit ", this.model.toJSON());
								
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