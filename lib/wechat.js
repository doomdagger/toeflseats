/**
 * Created by lihe9_000 on 2014/8/23.
 */

var api    = require('./api'),
    wechat = require('wechat'),
    List   = wechat.List;

module.exports = function () {
    List.add('demo', [
        ['回复{a}查看我的性别', api.demo.sex],
        ['回复{b}查看我的年龄', api.demo.age],
        ['回复{c}查看我的性取向', api.demo.sexuality]
    ]);

    List.add('1222', [
        ['回复{1}获取登陆验证码', api.seats.login],
        ['回复{2}获取查询验证码', api.seats.query]
    ]);
};
