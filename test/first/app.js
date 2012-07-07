jumpApp = undefined;
//$(document).bind("mobileinit", function(){
$(document).bind("mobileinit", function(){	
	jumpApp = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#appContainer',
		templateEngine: new jumpui.template.engine.Handlebars()
	});

	var Header = jumpui.block.Header.extend({
		templateKey: "header"
	});
	var footer = new jumpui.block.Footer({
		templateKey: "footer"
	});
	
	var loginPage = new jumpui.Page({
		name: "login",
		blocks: {
			'header':new Header(),
			'content': new jumpui.block.Content({
				events:{
					"click #btn":"open"
				},
				open:function() {
					alert('button clicked');
				},
				templateKey: "login"
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
				templateKey: "home"
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