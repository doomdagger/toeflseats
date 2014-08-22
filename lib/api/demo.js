/**
 * Created by lihe9_000 on 2014/8/23.
 */

var wechat = require('wechat'),

    demo;

demo = {
    sex: function (info, req, res) {
        res.reply('我是个妹子哈');
    },

    age: function (info, req, res) {
        res.reply('我今年18岁');
    },

    sexuality: function (info, req, res) {
        res.reply('这样的事情怎么好意思告诉你啦- -');
    }
};

module.exports = demo;