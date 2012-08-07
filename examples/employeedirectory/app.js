/**
 *	Employee Directory Demo based on employeedirectory.org by coenraets.org
 *
 *  This is just a demo application to show how similar appliation can be built using our framework.
 * 	
 *	dhavaln
 */
app = new jumpui.JqmApp({
    platform: jumpui.Platform.WEB,
    containerEl: '#appContainer',
    templateEngine: new jumpui.template.engine.Handlebars()
});

Handlebars.registerHelper('hasManager', function() {
	return this.employee.managerId != 0;
});

Handlebars.registerHelper('managerName', function() {
	var manager = app.employees.get(this.employee.managerId).toJSON();
	return manager.firstName + " " + manager.lastName;
});

app.Employee = Backbone.Model.extend({
    initialize: function() {
    }
});

app.EmployeeCollection = Backbone.Collection.extend({
    model: app.Employee,
	url: 'data/employees.json',
});

app.employees = new app.EmployeeCollection();
app.employees.fetch();

TemplateManager.loadTemplates(['index-page', 'employees-page', 'employee-detail'], function(){
});

var CommonHeader = jumpui.block.Header.extend({
	getContent:function(){
		return '<h3>Jumpbyte</h3>';
	}
});

var EmployeeHeader = jumpui.block.Header.extend({
	getContent:function(){
		return '<a href="javascript:history.go(-1);" data-direction="reverse" data-icon="back">Back</a><h3>Employee</h3><a href="#employees" data-iconpos="notext" data-icon="grid"></a>';
	}
});

var indexPage = new jumpui.Page({
    name:"index",
    route:"",
	
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

var employeesPage = new jumpui.Page({
    name:"employees",
	
	init: function(){
		this.model = {};
	},
	
    blocks:{
        'header':new CommonHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('employees-page');
			}
        })
    },
    prepare:function(){
		this.model.employees = app.employees.toJSON();
        return true;
    }
});

var employeesDetail = new jumpui.Page({
    name:"employees",
	route: "employeeDetail/:id",
	
	events: {
		"click .sms": "sendSMS",
		"click .addtocontact": "addToContact"
	},
	
	sendSMS: function(){
		alert("Send SMS");
	},
	
	addToContact: function(){
		alert("Add to Contact");
		app.navigate("employees");
	},
	
	init: function(){
		this.model = {};
	},
	
    blocks:{
        'header': new EmployeeHeader(),
        'content':new jumpui.block.Content({
			template: function(){
				return TemplateManager.get('employee-detail');
			}
        })
    },
	
    prepare:function(id){
		this.model.employee = app.employees.get(id).toJSON();
        return true;
    }
});

app.addPage(indexPage);
app.addPage(employeesPage);
app.addPage(employeesDetail);

setTimeout(function(){
	app.load();
},0);