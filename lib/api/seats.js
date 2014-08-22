/**
 * Created by lihe9_000 on 2014/8/23.
 */

var wechat  = require('wechat'),
    request = require('request'),
    _       = require('lodash'),
    http    = require('http'),
    fs      = require('fs'),
    path    = require('path'),
    when    = require('when'),
    codeRoot= path.resolve(__dirname, '../public/code/'),

    seats;

seats = {
    login: function (info, req, res) {

        var seed = Date.now() + Math.random(),
            got = when.defer();

        request.get("http://toefl.etest.net.cn/cn/"+seed+"VerifyCode3.jpg", function (error, response) {
            if (!error && response.statusCode == 200) {
                var rawHeader = response.headers['set-cookie'] && response.headers['set-cookie'][0],
                    sessionId;
                if (rawHeader && _.isString(rawHeader)) {
                    sessionId = rawHeader.substring(rawHeader.indexOf('=')+1, rawHeader.indexOf(';'));
                    req.session.etsId = sessionId;
                }
                got.resolve();
            } else {
                got.reject(error);
            }
        }).pipe(fs.createWriteStream(path.join(codeRoot, 'login.jpg')));

        when(got.promise).then(function () {
            res.reply([
                {
                    title: '登陆验证码',
                    description: '回复此验证码内容以登陆',
                    picurl: 'http://toefl.candylee.cn/code/login.jpg',
                    url: 'http://toefl.candylee.cn/'
                }
            ]);
        }).catch(function (error) {
            res.reply(error.message);
        });
    },

    query: function (info, req, res) {

    }
};

module.exports = seats;