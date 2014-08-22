/**
 * Created by lihe9_000 on 2014/8/23.
 */
var express = require('express'),

    frontendRoutes;

frontendRoutes = function () {
    var router = express.Router();

    router.get('/', function (req, res) {
        res.send('hello wechat!');
    });

    return router;
};

module.exports = frontendRoutes;