app = new jumpui.JqmApp({
    platform: jumpui.Platform.WEB,
    containerEl: '#appContainer',
    templateEngine: new jumpui.template.engine.Handlebars()
});

// Load all the templates
TemplateManager.loadTemplates(['index-page', 'apps-page', 'home-page', 'index-page', 'favorites-page', 'login-page', 'menu-detail', 'menu-list', 'menu-page', 'apps-list'], function(){
});

app.Menu = Backbone.Model.extend({
	return: {
		favorite: false
	}
});

app.MenuList = Backbone.Collection.extend({
	model: app.Menu,
	url: 'data/menu.json',
	parse: function(data){
		console.log("menu", data);
		return data.data;
	}
});

app.menu = new app.MenuList();
app.menu.fetch();

app.ViewList = Backbone.Collection.extend({
	model: app.Menu,
	localStorage: new Store("viewed")
});

app.recentlyViewed = new app.ViewList();
app.recentlyViewed.fetch();

app.Favorites = Backbone.Collection.extend({
	model: app.Menu,
	localStorage: new Store('favorites')
});

app.favorites = new app.Favorites();
app.favorites.fetch();

// Common Header
var CommonHeader = jumpui.block.Header.extend({
	getContent:function(){
		return '<h3>Jumpbyte</h3>';
	}
});

// After Login Header
var AppHeader = jumpui.block.Header.extend({
	getContent:function(){
		return '<a onclick="javascript:history.go(-1);">Back</a><h3>Jumpbyte</h3><a href="#home" data-icon="home" data-iconpos="notext">Home</a>';
	}
});

var indexPage = new jumpui.Page({
    name:"index",
    route:"",
	
	events: {
		'jui-pageloaded': 'pageLoaded'
	},
	
	initialize: function(){
		_.bindAll(this, "pageLoaded");
		
		this.processed = false;
	},
	
	pageLoaded: function(){
		var self = this;
		if(localStorage['userid']){
			self.$("#header").html("Please go to Home");
			self.$("#gotoHome").show();
		}else{
			self.$("#header").html("You need to Login to access the application");
			self.$("#gotoLogin").show();
		}
	},
	
    blocks:{
        'header':new CommonHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('index-page');
			}
        })
    },
    prepare:function(){
        return true;
    }
});

var loginPage = new jumpui.Page({
    name:"login",
    route:"login",
	
	events: {
		'submit form': 'checkLogin'
	},
	
	initialize: function(){
		_.bindAll(this, "checkLogin");
	},
	
	checkLogin: function(e){
		e.preventDefault();
		e.stopPropagation();
		var formData = this.$('form').serializeObject();
		if(formData.username == "test@test.com" && formData.password== "test"){
			
			// set local storage
			localStorage.setItem('userid', formData.username);
			
			this.app.navigate("home");
		}
	},
	
    blocks:{
        'header': new CommonHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('login-page');
			}
        })
    },
    prepare:function(){
        return true;
    }
});

var homePage = new jumpui.Page({
    name:"home",
	
	events: {
	},
	
	initialize: function(){
	},
	
    blocks:{
        'header': new CommonHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('home-page')
			}
        }),
		'footer': new jumpui.block.Footer({
			attributes: {
				'data-position': 'fixed',
				'data-role': 'footer'
			},
			getContent: function(){
				return "<h3><a href='http://www.jumpbyte.com'>Jumpbyte @ 2014</a></h3>";
			}
		})
    },
	
    prepare:function(){
        return true;
    }
});

var menuPage = new jumpui.Page({
    name:"menu",
	
	events: {
		'jui-pageloaded': 'pageLoaded',
		'click #refreshMenu': 'refreshMenu'
	},
	
	pageLoaded: function(){
		console.log("menu page loaded");
	},
	
	init: function(){
		console.log("menu page initialized");
		this.model = {};
	},
	
	refreshMenu: function(){
		var self = this;

		app.menu.fetch({
			success: function(){
				self.model.menu = app.menu.toJSON();
				self.blocks.content.fragments.menu.render();
				self.blocks.content.fragments.menu.refresh();
			}
		});
	},
	
    blocks:{
        'header': new AppHeader(),
        'content':new jumpui.block.Content({
            template: function(){
				return TemplateManager.get('menu-page');
			},
			
			fragments:{
				'menu': new jumpui.Fragment({
						template: function(){
							return TemplateManager.get('menu-list');
						},
			
						events:{
						},
						
						getModel:function(){
							
							var pageModel = this.block.page.model;
							console.log("model", pageModel);
							if(pageModel && pageModel.menu){
								return {'source': pageModel.menu};
							}else{
								return {};
							}
						},
						
						refresh: function(){
							this.$("ul").listview();
						}
					}),
				'view': new jumpui.Fragment({
						template: function(){
							return TemplateManager.get('menu-list');
						},
						
						events:{
							'click button':'testBtn'
						},
						testBtn: function(){
							alert('remote click attached');
						},
						getModel:function(){
							var pageModel = this.block.page.model;
							if(pageModel && pageModel.view){
								return {'source': pageModel.view.reverse()};
							}else{
								return {};
							}
						},
						refresh: function(){
							console.log(this);
							this.$("ul").listview();
						}
					})
				},
        }),
    },
	
    prepare:function(){
		var self = this;
		
		self.model.view = app.recentlyViewed.toJSON();
		self.model.menu = app.menu.toJSON();
	
        return true;
    }
});

var menuDetailPage = new jumpui.Page({
    name:"menuDetail",
	route: "menuDetail/:id",
	
	events: {
		'click #addFavorite': 'favorite'
	},
	
	favorite: function(){
		var item = app.menu.get(this.model.id).toJSON();

		if(!this.model.favorite){
			app.favorites.create(item);
		}else{
			app.favorites.get(item.id).destroy();
		}
		
		this.model.favorite = !this.model.favorite;
		
		this.blocks.content.fragments.favorite.render();
		this.blocks.content.fragments.favorite.refresh();
	},
	
	init: function(){
		console.log("menu detail page initialized");
		this.model = {};
	},
					
    blocks:{
        'header': new AppHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('menu-detail')
			},
			fragments: {
				'favorite': new jumpui.Fragment({
					template: function(){
						return '<a data-role="button" id="addFavorite" data-icon="star" {{#if favorite}}data-theme="b"{{/if}}>Favorite</a>';
					},
					
					getModel:function(){
						var pageModel = this.block.page.model;
						return {'favorite': pageModel.favorite};
					},
						
					refresh: function(){
						console.log(this);
						this.$("a[data-role=button]").button();
					}
				})
			}
        }),
    },
	
    prepare:function(id){
		console.log("menu id " + id);
		this.model.id = id;
		
		// add item in recently viewed list
		var item = app.menu.get(id).toJSON();
		this.model.item = item;
		
		app.recentlyViewed.create(item);
		if(app.recentlyViewed.length > 3){
			app.recentlyViewed.at(0).destroy();
		}
		
		if(app.favorites.get(item.id)){
			this.model.favorite = true;
		}else{
			this.model.favorite = false;
		}
		
        return true;
    },
});

var favoritesPage = new jumpui.Page({
    name:"favorites",
	
	init: function(){
		this.model = {};
	},
	
    blocks:{
        'header':new AppHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('favorites-page')
			}
        }),
    },
	
    prepare:function(){
		this.model.favorites = app.favorites.toJSON();
        return true;
    }
});

var appsPage = new jumpui.Page({
    name:"apps",
	
	events: {
		'click #survey': 'openSurvey'
	},
	
	openSurvey: function(){
		var self = this;
		
		if(!this.model.survey){
			$.mobile.loading('show', {text: 'Loading Survay', textVisible: true, theme: 'b'});
			this.addAppSource("survey", function(){
				self.model.survey = true;
				$.mobile.loading('hide');
				app.navigate("openApp/survey");
			});
		}else{
			app.navigate("openApp/survey");
		}
	},
	
	addApp: function(){
		var id = this.$("#appName").val();
		var self = this;
		
		this.addAppSource(id, function(){
			self.model.apps.push({'name': id, 'id': self.model.apps.length+1});
			self.blocks.content.fragments.appList.render();
			self.blocks.content.fragments.appList.refresh();
		});
	},
	
	addAppSource: function(id, callback){
		loadScript("apps/" + id + "/app.js", id, function(){
			loadTemplate("apps/" + id + "/app", callback);
		});
	},
	
	init: function(){
		this.model = {};
	},
	
    blocks:{
        'header': new AppHeader(),
		
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('apps-page')
			},
			
			fragments:{
				'appList': new jumpui.Fragment({
						template: function(){
							return TemplateManager.get('apps-list')
						},
						
						getModel:function(){
							var pageModel = this.block.page.model;
							if(pageModel){
								return {'source': pageModel.apps};
							}else{
								return {};
							}
						},
						
						refresh: function(){
							this.$("ul").listview();
						}
					})
				}
        }),
    },
	
    prepare:function(){
		if(!this.model.apps){
			this.model.apps = [];
		}
        return true;
    }
});

app.addPage(indexPage);
app.addPage(loginPage);
app.addPage(homePage);
app.addPage(menuPage);
app.addPage(favoritesPage);
app.addPage(menuDetailPage);
app.addPage(appsPage);

setTimeout(function(){
	app.load();
	console.log('application loaded, and nav to demo')
},0);