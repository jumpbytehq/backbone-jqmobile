todosApp = {};
$(document).bind("mobileinit", function(){	
	todosApp.app = new jumpui.JqmApp({
		platform: jumpui.Platform.WEB,
		containerEl: '#todoapp',
		templateEngine: new jumpui.template.engine.Handlebars()
	});
	   //Todo model and collection are directly taken from famous backbone todos example. http://documentcloud.github.com/backbone/examples/todos/
	
	  // Todo Model
	  // ----------

	  // Our basic **Todo** model has `title`, `order`, and `done` attributes.
	  todosApp.Todo = Backbone.Model.extend({

	    // Default attributes for the todo item.
	    defaults: function() {
	      return {
	        title: "empty todo...",
	        order: todos.nextOrder(),
	        done: false
	      };
	    },

	    // Ensure that each todo created has `title`.
	    initialize: function() {
	      if (!this.get("title")) {
	        this.set({"title": this.defaults.title});
	      }
	    },

	    // Toggle the `done` state of this todo item.
	    toggle: function() {
	      this.save({done: !this.get("done")});
	    },

	    // Remove this Todo from *localStorage* and delete its view.
	    clear: function() {
	      this.destroy();
	    }

	  });

	  // Todo Collection
	  // ---------------

	  // The collection of todos is backed by *localStorage* instead of a remote
	  // server.
	  todosApp.TodoList = Backbone.Collection.extend({

	    // Reference to this collection's model.
	    model: todosApp.Todo,

	    // Save all of the todo items under the `"todos"` namespace.
	    localStorage: new Store("todos-backbone"),

	    // Filter down the list of all todo items that are finished.
	    done: function() {
	      return this.filter(function(todo){ return todo.get('done'); });
	    },

	    // Filter down the list to only todo items that are still not finished.
	    remaining: function() {
	      return this.without.apply(this, this.done());
	    },

	    // We keep the Todos in sequential order, despite being saved by unordered
	    // GUID in the database. This generates the next order number for new items.
	    nextOrder: function() {
	      if (!this.length) return 1;
	      return this.last().get('order') + 1;
	    },

	    // Todos are sorted by their original insertion order.
	    comparator: function(todo) {
	      return todo.get('order');
	    }

	  });
	
	// Create our global collection of **Todos**.
	var todos = new todosApp.TodoList;
	todosApp.todos = todos; 
	todosApp.SecondLevelHeader = jumpui.block.Header.extend({
		template: "secondLevelHeader"
	});
	
	todosApp.pages = {
		todosPage: new jumpui.Page({
			name: "todosPage",	
			route:"",
		 	events: {
			 	'click .toggle':'handleToggle'
			},
			blocks: {
				'header':new jumpui.block.Header({
					template: "header"
				}),
				'content': new jumpui.block.Content({
					template: "todosPage"
				}),
				'footer':new jumpui.block.Footer({
					template: "footer"
				})
			},
			init:function() {
				_.bindAll(this, 'handleToggle')
			},
			prepare:function() {
				this.model={
					'todos': todos.toJSON(),
				 	'empty': todos.length==0};
				return true;
			},
			handleToggle:function(e){
				e.preventDefault();
				e.stopPropagation();
				console.log('in toggle: ', e);
				var todoEl = $(e.currentTarget);
				var todo = todos.get(todoEl.attr('data-todoId'));
				todo.toggle();
				if(todo.get('done')) {
					todoEl.children('img').attr('src', "images/checked_16.png")
				} else {
					todoEl.children('img').attr('src', "images/unchecked_16.png")
				} 
			}
		}),
		inputPage: new jumpui.Page({
			name: "inputPage",
			route: "input/:id",
			events:{
				'submit form':'addTodo',
				'click #deleteTodo':'deleteTodo'
			},
			init:function(){
				_.bindAll(this,'addTodo');
				_.bindAll(this,'deleteTodo');
			},
			addTodo:function(e){
				e.preventDefault();
				e.stopPropagation();
				var newTitle = this.$('#todoText').val();
				if(this.model.todo.id==undefined) {
					todos.create({ 'title': newTitle });
				} else {
					todos.get(this.model.todo.id).save({'title':newTitle});
				}
				console.log('Todo added successfully');
				todosApp.app.navigate('');
			},
			deleteTodo:function(e){
				todos.get(this.model.todo.id).destroy();
				console.log('Todo deleted successfully');
				todosApp.app.navigate('');
			},
			blocks: {
				'header':new todosApp.SecondLevelHeader({}),
				'content': new jumpui.block.Content({
					template: "inputPage"
				})
			},
			prepare:function(id) {
				if(id!='new') {
					this.model = {
						'title':'Update Todo',
						'todo':todos.get(id).toJSON(),
						'buttonText':'Update'
					};
				} else {
					this.model = {
						'title':'Add Todo',
						'todo': {'title':''},
						'buttonText':'Create'
					};
				}
				return true;
			}
		}),
		aboutPage: new jumpui.Page({
			name: "about",
			blocks: {
				'header':new todosApp.SecondLevelHeader({
					prepare:function(){
						this.model = {title: 'About App'};
						return true;
					}
				}),
				'content': new jumpui.block.Content({
					template: "aboutPage",
					prepare:function(title) {
						this.model = {'title':title};
						return true;
					}
				})
			},
			prepare:function(title) {
				return true;
			}
		})
	};
	
	todosApp.app.addPage(todosApp.pages.todosPage);
	todosApp.app.addPage(todosApp.pages.inputPage);
	todosApp.app.addPage(todosApp.pages.aboutPage);
	todos.fetch();
});

// $(document).ready(function() {	
$(document).bind("mobileinit", function(){
	setTimeout(function(){
		//$.mobile.changePage("#new");
	    todosApp.app.load();
 	},1);
});