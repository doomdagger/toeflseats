/**
 * Created by lihe9_000 on 2014/8/23.
 */
var express = require('express'),
    wechat  = require('wechat'),
    api     = require('../api'),

    token = 'ILoveYou',
    wechatRoutes;

wechatRoutes = function () {
    var router = express.Router();

    router.all('/', wechat(token, wechat.text(function (info, req, res) {
        if (info.Content === '1222') {
            res.wait('1222');
        } else {
            if (req.wxsession.codeFlag === 1) {
                api.seats.handleLogin(info, req, res);
            } else if (req.wxsession.codeFlag === 2) {
                api.seats.handleQuery(info, req, res);
            } else {
                // 或者中断等待回复事务
                res.nowait([
                    {
                        title: '托福考位查询服务',
                        description: '我与大家一样，也是在备战出国的孩纸，备考之余写了此程序，仅提供托福考位查询服务。因为频繁刷新考位会导致IP被封，所以此服务提供的考位信息并不具有实时性，本服务的信息刷新频率为10min/次，点击阅读全文查看考位信息',
                        picurl: 'http://toefl.candylee.cn/images/TOEFL.png?' + Math.random(),
                        url: 'http://toefl.candylee.cn/'
                    }
                ]);
            }
        }
    })));

    return router;
};

module.exports = wechatRoutes;