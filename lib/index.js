/**
 * Created by lihe9_000 on 2014/8/22.
 */

var express = require('express'),
    when    = require('when'),
    path    = require('path'),
    colors  = require('colors'),

    wechat  = require('./wechat'),
    middleware = require('./middleware'),

    httpServer;

// If we're in development mode, require "when/console/monitor"
// for help in seeing swallowed promise errors, and log any
// stderr messages from bluebird promises.
if (process.env.NODE_ENV === 'development') {
    require('when/monitor/console');
}

function wechatStartMessages() {
    console.log("ToeflSeats is running now...".green
        , "\nFor detail info, please visit http://git.candylee.cn/".green
        , "\nPress Ctrl+C to quit".yellow);
}

// options - {server: express instance, port: , host: }
function init(options) {
    options = options || {};

    var deferred = when.defer(),
        server = options.server || express();

    // view engine setup
    server.set('views', path.join(__dirname, 'views'));
    server.set('view engine', 'ejs');

    wechat();
    middleware(server);

    httpServer = server.listen(
        options.port || '1222',
        options.host || '0.0.0.0'
    );

    httpServer.on('listening', function () {
        wechatStartMessages();
        deferred.resolve(httpServer);
    });

    return deferred.promise;
}

module.exports = init;
