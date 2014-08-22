/**
 * Created by lihe9_000 on 2014/8/22.
 */
var express     = require('express'),
    path        = require('path'),
    favicon     = require('static-favicon'),
    logger      = require('morgan'),
    cookieParser= require('cookie-parser'),
    bodyParser  = require('body-parser'),
    session     = require('express-session'),
    errorhandler= require('errorhandler'),

    routes      = require('../routes'),

    expressServer,
    setupMiddleware;


setupMiddleware = function (server) {
    var rootDir = '/';

    expressServer = server;

    expressServer.use(logger('dev'));

    expressServer.use(rootDir, favicon());

    expressServer.use(express['static'](path.join(__dirname, '../', 'public')));


    expressServer.use(bodyParser.json());
    expressServer.use(bodyParser.urlencoded());
    expressServer.use(cookieParser());
    expressServer.use(session({secret: 'keyboard cat', cookie: {maxAge: 60000}}));
    expressServer.use(express.query());

    expressServer.use(rootDir, routes.frontend());
    expressServer.use('/wechat', routes.wechat());

    // catch 404 and forward to error handler
    expressServer.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /// error handlers
    expressServer.use(errorhandler());
};

module.exports = setupMiddleware;