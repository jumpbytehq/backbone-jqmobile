# backbone-jqmobile

Backbone provides very good modularization and MV* pattern for javascript applications. On the other hand jquery-mobile is having very easy to use, versatile, cross-device compatible HTML5 mobile UI framework.

After developing couple of applications on jquery-mobile and backbone, We quickly realize that its not simple to use both together as both are overlapping on few areas. 

This framework addresses following  
1. Backbone and Jquery-mobile integration.  
2. Backbone based jquery-mobile classes and widgets.

##Terminology##
**jumpui**  
jumpui is global namespace used. 

###Core####
**JqmApp** (jumpui.JqmApp)  
JqmApp is application class, There should be only one instance per app.

**Platform** (jumpui.Platform)  
Specifies platform on which this application should run.  
i.e. WEB, CORDOVA.  
*Note:* Currently only WEB as platform is supported. But it also works just fine on CORDOVA. This class is mainly for future use.

**TemplateEngine** (jumpui.TemplateEngine)  
backbone-jqmobile supports templating out of box.  
	* jumpui.template.engine.Handlebars   
	* jumpui.template.engine.Underscore (Not implemented yet)

###View###
All the view classes are extended from Backbone.View, so most of the features of Backbone.View should work.

**Page**  
Page is root (parent) UI element which takes up whole page area.  
Each page has name & route(URL hash) attribute. So when back button is clicked app will display (and execute proper call chain) of previous page.  
Basically it is Jquery-mobile data-role='page' div. 

 
**Block**  
Block is reusable component within page. Page can contain many blocks. Block can return any HTML content generated manually or generated using template manually. But Ideally Block accepts *template* as attributes, and it will be rendered using specified templateEngine in backbone-jqmobile App instance.

Currently following blocks are implemented and ready to use.  
  * Header  
  * Content    
  * Footer  

Block and Page share lot of common features.

*Note:* Currently all blocks are rendered sequentially within Page, but later on, there will be template for Page too.

**Events**


###Widget (coming soon)###
Widgets are jquery mobile views, binded with Backbone.Model or Backbone.Collection.  
Takes away pain with refreshing jquery-mobile views, when data changes. Allows programatically creation of forms/list easily.

Some of planned widgets are  
  * ListView (collection backed)  
  * Popup (Model backed)  
  * Form  
  * etc.  
  

###Demo###

**Basic Application Structure**   
```javascript  

	//Main app instance
	app = new jumpui.JqmApp({
	    platform: jumpui.Platform.WEB,
	    containerEl: '#appContainer',
	    templateEngine: new jumpui.template.engine.Handlebars()
	});
	
	var demoPage = new jumpui.Page({
	    name:"Demo",
	    
		route:"demo", // If ommitted, page name will be used as a route
		
		// similar to standard backbone events
		// has additional framework events
		events: {
			'jui-pageloaded': 'pageLoaded'
		},
		
		pageLoaded: function(){
		},
		
		// will be called only once when page is initialized first time
		init: function(){
		},
		
		// Series of content, each block is a separate view
		// Blocks can accept pure HTML content via getContent() or template via template key
	    blocks:{
	        'header': new jumpui.block.Header({
	            getContent:function(){
	                return '<h3>Demo</h3>';
	            }
	        }),
			
	        'content':new jumpui.block.Content({
				template: "<p>{{text}}<p>"
	        }),
			
			'footer': new jumpui.block.Footer({
				// Can specify additional attributes which will be appended to target element
				attributes: {
					'data-position': 'fixed',
					'data-role': 'footer'
				},
				getContent: function(){
					return "<h3>Demo Footer</h3>";
				}
			})
	    },
		
		// will be called everytime page is displayed
	    prepare:function(){
	        this.model={'text':'hello world'};
	        return true;
	    }
	});
	
	//add page to app                
	app.addPage(demoPage);
	
	//fix for now
	setTimeout(function(){
		app.load();
	},0);
``` 

Demo On [JSFiddle](http://jsfiddle.net/nachiket/mtLkk/)

For more demo check - http://apps.jumpbyte.com/backbone-jqmobile/