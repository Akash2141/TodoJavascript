const Router = require('./Router');
const { createServer } = require('http');
const mysql = require('mysql');
const router = new Router();
const defaultHeader = { "Content-Type": "application/text" };
class TodoServer {
    constructor(todo) {
        this.todos = [];
        this.server = createServer((request, response) => {
            let resolved = router.resolve(this, request);
            console.log("resolving the server");
            if (!resolved) {
                console.log("not resolved");
                response.writeHead(200);
                response.end("Akash");
            }
            console.log(resolved);
            if (resolved) {
                resolved.catch(error => {
                    if (error.status != null) return error;
                    return { body: String(error), status: 500 }
                }).then(({ body, status = 200, headers = defaultHeader }) => {
                    response.writeHead(status, headers);
                    response.end(body);
                });
            }
        });
    }
    start(port) {
        console.log("This app is starting");
        this.server.listen(port);
    }
    stop() {
        this.server.close();
    }
}
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb",
    port: 3306
});
// console.log(con);
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
function readStream(stream) {
    return new Promise((resolve, reject) => {
        let data = "";
        stream.on("error", reject);
        stream.on("data", chunk => data += chunk.toString());
        stream.on("end", () => resolve(data));
    });
};
router.add("GET", "/todos", async (server) => {
    let sql = "select * from todo";
    let stringResult = '';
    var result=new Promise((resolve,reject)=>{
        con.query(sql, (err, result) => {
            if (err) throw err;
            stringResult = JSON.stringify(result);
            resolve(stringResult);
            reject(err=>err);
        });
    })
    await result.then(data=>console.log('this is',data)).catch(err=>console.log('this is error',err));
    return { body: stringResult, headers: "application/json" };
});
router.add("POST", "/todos/add", async (server, path, request) => {
    console.log(request);
    let requestBody = await readStream(request);
    let jsObj = JSON.parse(requestBody);
    let sql = `insert into todo(task,status,edit) values("${jsObj.task}",${jsObj.status},${jsObj.edit});`;
    con.query(sql, (err, result) => {
        if (err) throw err;
    });
    return { body: requestBody, headers: "application/json" };
});
router.add("DELETE", /\/todo\/delete\/\d+/, async (server, path, request) => {
    console.log("this is under the delete");
    // console.log('this is the path',path);
    // console.log('this is the request',request);
    let id=path.slice(13,);
    console.log(id);
    // let requestBody = await readStream(request);
    // let jsObj = JSON.parse(requestBody);
    let sql = `delete from todo where id=${id};`;
    con.query(sql, (err, result) => {
        if (err) throw err;
    });
    return { body: "sccessfully deleted", headers: "application/json" };
});
router.add("PUT", "/todos/update", async (server, path, request) => {
    // console.log(request);
    let requestBody = await readStream(request);
    let jsObj = JSON.parse(requestBody);
    console.log("this is the update",jsObj);
    let sql = `update todo set task="${jsObj.task}" where id=${jsObj.id};`;
    console.log(sql);
    await con.query(sql, (err, result) => {
        
        if (err) throw err;
        console.log("This is the result",result);
    });
    return { body: requestBody, headers: "application/json" };
});
// router.add("PUT","/todos/id")
new TodoServer(Object.create(null)).start(8080);