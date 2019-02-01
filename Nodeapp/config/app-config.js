'use strict'
const bodyParser = require('body-parser');
const cors = require('cors');
const expressConfig = require('./express-config');

class ConfigApp {

    constructor(app) {
        this.app = app;
        this.configureApp();
    }

    configureApp() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        new expressConfig(this.app);
    }

}
module.exports = ConfigApp;