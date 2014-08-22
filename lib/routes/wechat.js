/**
 * Created by lihe9_000 on 2014/8/23.
 */
var express = require('express'),
    wechat      = require('wechat'),

    token = 'ILoveYou',
    wechatRoutes;

wechatRoutes = function () {
    var router = express.Router();

    router.use('/', wechat(token, wechat.text(function (info, req, res) {
        if (info.Content === 'list') {
            res.wait('view');
        } else {
            res.reply('hehe');
            // 或者中断等待回复事务
            // res.nowait('hehe');
        }
    })));

    return router;
};

module.exports = wechatRoutes;