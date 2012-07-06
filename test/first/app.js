jumpApp = undefined;
//$(document).bind("mobileinit", function(){
$(document).bind("mobileinit", function(){	
	jumpApp = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#appContainer'
	});

	var homePage = new jumpui.Page("home", {
	});
	jumpApp.addPage(homePage);
});
// 
$(document).ready(function() {
	setTimeout(function(){
		jumpApp.load();
	},1000);
});