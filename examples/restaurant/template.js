TemplateManager = {

	root: "templates",
	
    // Hash of preloaded templates for the app
    templates:{},

    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates:function (names, callback) {
        var self = this;

        var loadTemplate = function (index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            
            var data = $.ajax({type: 'GET', url: self.root + '/' + name + '.html', async: false}).responseText;
            self.templates[name] = data;
            index++;
            if (index < names.length) {
                loadTemplate(index);
            } else {
                callback();
            }
        }

        loadTemplate(0);
    },

    // Get template by name from hash of preloaded templates
    get:function (name) {
    	if(this.templates[name] && this.templates[name] != ""){
    		return this.templates[name];
    	}else{
    		console.log("no template found for name " + name);
    		return "<div>no template data found</div>";
    	}
    }

};