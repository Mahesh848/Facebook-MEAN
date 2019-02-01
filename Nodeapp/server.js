const express = require('express');
const routes = require('./web/routes');
const http = require('http');
const appConfig = require('./config/app-config');
const socket = require('socket.io');
const socketHandler = require('./routes_handlers/socket-handler');

class Server {
    constructor() {
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socket(this.http); 
    }

    configureApp() {
        new appConfig(this.app).configureApp();
    }

    includeRoutes() {
        new routes(this.app).includeRoutes();
        new socketHandler(this.socket).socketConfig();
    }

    createServer() {

        this.configureApp();
        this.includeRoutes();

        const port = 1848;
        this.http.listen(port, (err) => {
            if(err) {
                console.log(err);
            }
            else{
                console.log('Server Listening on '+port);
            }
        });
    }
}

const server = new Server();
server.createServer();
