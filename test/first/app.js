jumpApp = undefined;
//$(document).bind("mobileinit", function(){
$(document).bind("mobileinit", function(){	
	jumpApp = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#appContainer',
		templateEngine: jumpui.template.engine.UNDERSCORE
	});

	var Header = jumpui.block.Header.extend({
		getContent:function(){
			return "<h3>App Header</h3>" ;
		}
	});
	var footer = new jumpui.block.Footer({
		getContent:function(){
			return "<h3>App Footer</h3>" ;
		}
	});
	
	var loginPage = new jumpui.Page({
		name: "login",
		blocks: {
			'header':new Header(),
			'content': new jumpui.block.Content({
				events:{
					//"click #btn":"open"
				},
				open:function() {
					alert('button clicked');
				},
				getContent:function(){
					return "<h3>App Content</h3> <a href='#home' id='btn' data-role='button'>Klick!</a>" ;
				}
			}),
			'footer':footer
		},
		prepare:function() {
			this.model={title: "Abcd"};
			this.render();
		}
	});
	jumpApp.addPage(loginPage);

	var homePage = new jumpui.Page({
		name: "home",
		blocks: {
			'header':new Header(),
			'content': new jumpui.block.Content({
				getContent:function(){
					return "<h3>Home Content</h3>" ;
				}
			}),
			'footer':footer
		},
		prepare:function() {
			this.model={title: "Abcd"};
			this.render();
		}
	});
	jumpApp.addPage(homePage);

	
});
// 
$(document).ready(function() {
	setTimeout(function(){
		jumpApp.load();
	},1000);
});