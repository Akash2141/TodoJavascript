var textInput = document.getElementById("todo-text");
var todoList = document.getElementById("todo-list");

var todoApp = {
    addTodo: function () {
        let todoText = textInput.value;
        let newTodo = {
            task: todoText,
            status: false,
            edit: false
        };
        todoService.addTodo(newTodo);
        this.appendElement(newTodo);

        pagination.render();
        pagination.gotoLastPage();
    },
    appendElement: function (todo) {
        var itemView = this.parseHtml(this.getItemView(todo));
        todoList.appendChild(itemView);
    },
    parseHtml: function (html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        // console.log('this is the t',t);
        // console.log('this is the clone of the t',t.content.cloneNode(true));
        return t.content.cloneNode(true);
    },
    getItemView: function (todo) {
        let buttonText = "completed";
        let btnUndoRedo = "";
        let btnDelete = `<button onclick='todoApp.removeTodo(this,${todo.id})' class='btn btn-primary ml-3'>remove</button>`;
        let html1 = "";
        // let todo = state.todos[i];
        let todoItemStyle = "";
        let btnUndoRedoText = "complete";
        if (todo.status == true) {
            todoItemStyle = "todo-completed";
            btnUndoRedoText = "undo";
        }
        btnUndoRedo = `<button type="button" onclick="todoApp.onToggleTodos(this,${todo.id})" class="btn btn-primary ml-3">${btnUndoRedoText}`
        //we can use todo.task instead state.todos[i].task=>yes we can use;
        html1 += `<li id='${todo.id}' class='${todoItemStyle} mb-2'>${todo.task}${btnUndoRedo}${btnDelete}`;
        if (todo.edit) {
            html1 = `
                    <li id='${todo.id}' class='${todoItemStyle} mb-2'>
                        <input onkeyup="todoApp.onUpdateTodo(event,${todo.id})" type="text" value="${todo.task}"/>${btnUndoRedo}${btnDelete}
                    </li>
                `;
        }
        return html1;
    },
    removeTodo: function (el, todoId) {
        console.log("this is the todo js")
        todoService.removeTodo(todoId).then(data => console.log(data)).catch(err => console.log(err));
        this.removeElement(el.parentNode);
        pagination.render();
        pagination.gotoLastPage();
    },
    removeElement: function (parent) {
        console.log("element: ", parent);
        console.log(parent);
        todoList.removeChild(parent);
        // console.log(todoList.removeElement(parent));
        // this.removeTodo(parent);
    },
    onToggleTodos: function (el, todoId) {
        let todo = todoService.toggleComplete(todoId);
        this.updateElement(el.parentNode, todo);
    },
    updateElement: function (parent, todo) {
        console.log(todo);
        parent.outerHTML = this.getItemView(todo);
    },
    onUpdateTodo(event, todoId) {
        if (event.which == 27) {
            this.toggleEdit(event.target.parentNode, todoId);
        } else if (event.which == 13) {
            todoService.updateTodo(todoId, event.target.value);
            // console.log('this is the target parent',event.target.parentNode);
            fetch("http://localhost:8080/todos/update", {
                method: "PUT",
                body: JSON.stringify({
                    "id": todoId,
                    "task": event.target.value
                }),
                mode: 'cors',
                // protocol:'http:',
                headers: {
                    'Content-Type': 'application/json'
                  }
            })
                .then(response => {
                    console.log(response);
                    return response;
                })
                .then(response => console.log(response)).catch(error => {
                    console.log("THis is the error");
                    console.log(error)
                });
            this.toggleEdit(event.target.parentNode, todoId);
        }
    },
    toggleTodos: function (el) {
        let getParent = el.parentNode;
        state.todos.map(node => {
            if (node.id == getParent.id) {
                node.status = !node.status;
            }
            return node;
        });
        this.render();
    },
    render: function (todos) {
        // let todos = todoService.getAll();
        if (todos.length === 0) {
            todoList.innerHTML = "<h3>No todo's available.....<h3>";
            return;
        }
        let html = "";
        for (let i = 0; i < todos.length; i++) {
            html += this.getItemView(todos[i]);
        }
        todoList.innerHTML = html;
    },
    onToggleEdit: function () {
        if (event.target.tagName.toLowerCase() != "li") return;
        console.log(event.target.tagName);
        let todoId = event.target.id;
        this.toggleEdit(event.target, todoId);
    },
    toggleEdit: function (target, todoId) {
        let todo = todoService.toggleEdit(todoId);
        this.updateElement(target, todo);
    }
};
// todoApp.render(todoService.getPagesData(1,pagination.pageLength));
todoService.getPagesData(1, pagination.pageLength).then(data => {
    console.log('getPagesData', data);
    todoApp.render(data);
}).catch(error => console.log(error));