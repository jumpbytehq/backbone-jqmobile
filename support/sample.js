
var header = new jumpui.Header({
	title: "My app",
	buttons: [
		new jumpui.Button( { text:Logout, icon:"delete"}), 
		new jumpui.Button( { 
			text:Status, 
			events: {
				'click': function(button) {}
			}
		}), 
	],
	theme:"a"
});

var app = new jumpui.JqmApp({
	platform:new jumpui.Cordova(),
	containerEl: $("body")
}, {
	defaultHeader:header,
	defaultFooter:footer
});

var homePage = new jumpui.Page({
	template: "homePage.tpl"
});

var aboutPage = new jumpui.Page({
	template: "aboutPage.tpl"
});


var categoriesPage = new jumpui.Page({
	widgets: [
		new jumpui.w.List({
			collection:Categories,
			listItemClass: CategoryItem
		}),
		new jumpui.w.Button({
			text:"Show All",
			click:function({	})
		})
	]
});

app.addPage('home', homePage);
app.addPage('about', aboutPage);


app.goto('home');
