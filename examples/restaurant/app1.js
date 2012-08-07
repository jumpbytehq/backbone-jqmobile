//Main app instance
app = new jumpui.JqmApp({
    platform: jumpui.Platform.WEB,
    containerEl: '#appContainer',
    templateEngine: new jumpui.template.engine.Handlebars()
});

var demoPage = new jumpui.Page({
    name: "Demo",

    route: "",
	
    // If ommitted, page name will be used as a route
    // similar to standard backbone events
    // has additional framework events
    events: {
        'jui-pageloaded': 'pageLoaded'
    },

    pageLoaded: function() {},

    // will be called only once when page is initialized first time
    init: function() {},

    // Series of content, each block is a separate view
    // Blocks can accept pure HTML content via getContent() or template via template key
    blocks: {
        'header': new jumpui.block.Header({
            getContent: function() {
                return '<h3>Demo</h3>';
            }
        }),

        'content': new jumpui.block.Content({
            template: function(){
				return "<p>{{text}}<p>";
			}
        }),

        'footer': new jumpui.block.Footer({
            // Can specify additional attributes which will be appended to target element
            attributes: {
                'data-position': 'fixed',
                'data-role': 'footer'
            },
            getContent: function() {
                return "<h3>Demo Footer</h3>";
            }
        })
    },

    // will be called everytime page is displayed
    prepare: function() {
        this.model = {
            'text': 'hello world'
        };
        return true;
    }
});

//add page to app                
app.addPage(demoPage);

//fix for now
setTimeout(function() {
    app.load();
}, 0);