'use strict'
const express = require('express');
const path = require('path');
class ExpressConfig{
    constructor(app) {
        this.app = app;
        this.expressConfig();
    }
    expressConfig() {
        this.app.set('view engine','html');
        this.app.use(express.static(path.join('public')));
    }
}
module.exports = ExpressConfig;