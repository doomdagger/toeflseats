/**
 * Created by lihe9_000 on 2014/8/23.
 */
var express = require('express'),
    api     = require('../api'),

    frontendRoutes;

frontendRoutes = function () {
    var router = express.Router();

    router.get('/', api.seats.briefView);

    router.get('/seat', api.seats.seat);
    router.get('/brief', api.seats.brief);

    return router;
};

module.exports = frontendRoutes;