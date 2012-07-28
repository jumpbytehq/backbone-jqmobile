jumpApp = {};
$(document).bind("mobileinit", function(){	
	jumpApp.app = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#appContainer',
		templateEngine: new jumpui.template.engine.Handlebars()
	});
	
	jumpApp.Header = jumpui.block.Header.extend({
		templateKey: "header"
	});
	jumpApp.footer = new jumpui.block.Footer({
		templateKey: "footer"
	});
	
	jumpApp.pages = {
		loginPage: new jumpui.Page({
			name: "login",
			route:"",
			blocks: {
				'header':new jumpApp.Header(),
				'content': new jumpui.block.Content({
					events:{
						"click #xyz":"open"
					},
					fragments:{
						'localAdFragment': new jumpui.Fragment({
							templateKey:'adFragment',
							events:{
								'click button':'testBtn'
							},
							testBtn: function(){
								alert('click attached');
								
							},
							getModel:function(){
								return {'source':'Local'};
							}
						}),
						'remoteAdFragment': new jumpui.Fragment({
							templateKey:'adFragment',
							events:{
								'click button':'testBtn'
							},
							testBtn: function(){
								alert('remote click attached');
							},
							getModel:function(){
									return {'source':'Remote'};
							}
						})
					},
					open:function() {
						alert('button clicked');
					},
					templateKey: "login"
				}),
				'footer':jumpApp.footer
			},
			prepare:function() {
				this.model={title: "Abcd"};
				return true;
			}
		}),
		homePage: new jumpui.Page({
			name: "home",
			route: "home",
			blocks: {
				'header':new jumpApp.Header(),
				'content': new jumpui.block.Content({
					templateKey: "home"
				}),
				'footer':jumpApp.footer
			},
			prepare:function() {
				this.model={title: "Abcd"};
				return true;
			}
		}),
		aboutPage: new jumpui.Page({
			name: "about",
			route:"about/:title",
			blocks: {
				'header':new jumpApp.Header(),
				'content': new jumpui.block.Content({
					templateKey: "about",
					prepare:function(title) {
						this.model = {'title':title};
						return true;
					}
				}),
				'footer':jumpApp.footer
			},
			prepare:function(title) {
				this.model={title: 'Page title'};
				return true;
			}
		})
	};
	
	jumpApp.app.addPage(jumpApp.pages.loginPage);
	jumpApp.app.addPage(jumpApp.pages.homePage);
	jumpApp.app.addPage(jumpApp.pages.aboutPage);
});

// $(document).ready(function() {	
$(document).bind("mobileinit", function(){
	setTimeout(function(){
		//$.mobile.changePage("#new");
	    jumpApp.app.load();
 	},1);
});