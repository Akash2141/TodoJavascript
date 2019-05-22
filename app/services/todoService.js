//state contain the some basic point
var state = {
    todos: []
};
// todoService.getTodoList().then(data => {
//     console.log(data);
// }).catch(error => console.log('this is todo error', error));
// for (let i = 2; i <= 50; i++) {
//     state.todos.push({
//         id: i,
//         task: "some random task " + i,
//         state: false,
//         edit: false
//     });
// }
// function fetchOK(url, options) {
//     return fetch(url, options).then(response => {
//         if (response.status < 400) {
//             console.log(response);
//             return response.text();
//         } else throw new Error(response.statusText);
//     });
// };
// async function getData1() {
//     return await fetchOK("http://localhost:8080/todos", { method: "GET" });
// };
// getTodoList = async function () {
//     let pageData1;
//     await getData1().then((resolve) => {
//         let parseResolve = JSON.parse(resolve);
//         pageData1 = parseResolve;
//         state.todos = [];
//         pageData1.map(data => state.todos.push(data));
//         console.log(state.todos);
//     }).catch(error => { console.log('this is the error', error); });
//     console.log(state.todos);
//     return pageData1;
// };
// getTodoList().then(data => {
//     console.log(data);
// }).catch(error => console.log('this is todo error', error));

var todoService = {
    getAll: function () {
        return state.todos;
    },
    fetchOK: function (url, options) {
        return fetch(url, options).then(response => {
            if (response.status < 400) {
                console.log(response);
                return response.text();
            } else throw new Error(response.statusText);
        });
    },
    getData1: async function () {
        return await todoService.fetchOK("http://localhost:8080/todos", { method: "GET" });
    },
    getTodoList: async function () {
        let pageData1;
        await todoService.getData1().then((resolve) => {
            let parseResolve = JSON.parse(resolve);
            pageData1 = parseResolve;
            state.todos = [];
            pageData1.map(data => state.todos.push(data));
            console.log(state.todos);
        }).catch(error => { console.log('this is the error', error); });
        console.log(state.todos);
        return pageData1;
    },
    addTodo: function (newTodo) {
        console.log(newTodo);
        // newTodo.id = state.todos.length + 1;
        // let maxId = Math.max(...state.todos.map(todo => todo.id));
        // let maxId = Math.max.apply(Math, state.todos.map(todo => todo.id));
        // console.log(maxId);
        // newTodo.id = maxId + 1;
        // state.todos = [...state.todos, newTodo];
        todoService.fetchOK("http://localhost:8080/todos/add", {
            method: "POST", body: JSON.stringify({
                "id": 5,
                "task": newTodo.task,
                "edit": newTodo.edit,
                "status": newTodo.status
            })
        });
    },
    updateTodo: function (todoId, value) {
        let todo = todoService.findTodo(todoId);
        todo.task = value;
        console.log(value);
    },
    findTodo: function (todoId) {
        let todo = state.todos.find(todo => {
            return (todo.id == todoId);
        });
        return todo;
    },
    removeTodo: async function (todoId) {
        let todos = state.todos.filter(todo => {
            return todo.id != todoId;
        });
        console.log("this is the todoId", todoId);
        fetch(`http://localhost:8080/todo/delete/${todoId}`, {
            method: "DELETE",
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((data) => console.log(data)).catch(err => console.log(err));

        // state.todos = [...todos];
    },
    toggleEdit: function (todoId) {
        console.log('todo id', todoId);
        let todo = todoService.findTodo(todoId);
        todo.edit = !todo.edit;
        return todo;
    },
    toggleComplete: function (todoId) {
        let currentTodo;
        let todos = state.todos.map(todo => {
            if (todo.id == todoId) {
                currentTodo = todo;
                todo.status = !todo.status;
            }
            return todo;
        });
        state.todos = [...todos];
        return currentTodo;
    },
    getTodoCount: function () {
        return state.todos.length;
    },
    getPagesData: async function (pageNo, pageLength) {
        let startOfRecord = (pageNo - 1) * pageLength;
        let endOfRecord = startOfRecord + pageLength;
        console.log(state.todos);
        let pagedData = state.todos.slice(startOfRecord, endOfRecord);
        let data1;
        await todoService.getTodoList().then(data => {
            data1 = data;
        }).catch(error => console.log('this is todo error', error));
        return data1;
    }
};


