const { parse } = require('url');
module.exports = class Router {
    constructor() {
        this.routes = [];
    }
    add(method, url, handler) {
        this.routes.push({ method, url, handler });
    }
    resolve(context, request) {
        let path = parse(request.url).pathname;
        for (let { method, url, handler } of this.routes) {
            let match = new RegExp(url).exec(path);
            if (!match || request.method != method) continue;
            return handler(context, path, request);
        }
        return null;
    }
}
