'use strict';
const parseUrl = require('url').parse;
const queryString = require('querystring').parse;

class Router {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        }
    }

    get(path, cb) {
        this.routes.GET[path] = cb;
    }

    post(path, cb) {
        this.routes.POST[path] = cb;
    }

    put(path, cb) {
        this.routes.PUT[path] = cb;
    }

    del(path, cb) {
        this.routes.DELETE[path] = cb;
    }

    route(req, res) {
        const method = req.method;

        if (method === "PUT" || method === "POST") {
        }

        req.url = parseUrl(req.url);
        req.url.query = queryString(req.url.query);
        // console.log('URL:', req.url.href);
        // console.log('QUERY:', req.url.query);

        let path = req.url.pathname;
        const route = this.routes[method][path];
        if (!route) {
            throw `router 404 Not Found: ${method} ${req.url}`;
        }
        route(req, res);
    }

    tryRoute(req, res) {
        try {
            return this.route(req, res);
        } catch (error) {
            console.log('ERROR:', error)

            let code = 500;
            if (error && error.substr) {
                let status = error.substr(0, 3)
                code = parseInt(status, 10);
                if (isNaN(code) || code < 300 || code >= 499) {

                    code = 500;
                }
            }
            res.writeHead(code);
            res.write(error);
            res.end();
            return;
        }
    }
}

module.exports = Router;