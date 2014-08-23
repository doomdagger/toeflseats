/**
 * Created by lihe9_000 on 2014/8/23.
 */

var wechat  = require('wechat'),
    request = require('request'),
    iconv = require('iconv-lite'),
    _       = require('lodash'),
    http    = require('http'),
    fs      = require('fs'),
    path    = require('path'),
    when    = require('when'),

    dom     = require('./dom'),
    codeRoot= path.resolve(__dirname, '../public/code/'),

    seats,
    sessionId = null,
    sessionStatus,
    seatsCache = null;

seats = {
    login: function (info, req, res) {
        var now  = Date.now(),
            seed = now + Math.random(),
            got = when.defer();

        // session若是仍然有效，通知用户无需登陆操作
        if (sessionId && (now - sessionStatus) < 60*5*1000) {
            res.reply("亲，已经登陆，且session有效时间还剩下"+ Math.floor((5000 - (now - sessionStatus))/1000) + "秒");
            return;
        }

        request.get("http://toefl.etest.net.cn/cn/"+seed+"VerifyCode3.jpg", function (error, response) {
            if (!error && response.statusCode == 200) {
                var rawHeader = response.headers['set-cookie'] && response.headers['set-cookie'][0];
                if (rawHeader && _.isString(rawHeader)) {
                    sessionId = rawHeader.substring(rawHeader.indexOf('=')+1, rawHeader.indexOf(';'));
                    sessionStatus = Date.now();
                }
                got.resolve();
            } else {
                got.reject(error);
            }
        }).pipe(fs.createWriteStream(path.join(codeRoot, 'login.jpg')));

        when(got.promise).then(function () {
            req.wxsession.codeFlag = 1;
            res.reply([
                {
                    title: '登陆验证码',
                    description: '回复此验证码内容以登陆',
                    picurl: 'http://toefl.candylee.cn/code/login.jpg?'+Math.random(),
                    url: 'http://toefl.candylee.cn/code/login.jpg'
                }
            ]);
        }).catch(function (error) {
            res.reply(error.message);
        });
    },

    handleLogin: function (info, req, res) {
        var name = "3348081",
            pass = "Lxy910802",
            code = info.Content,
            got = when.defer();

        var postData = "username="+name+"&password="+pass+"&LoginCode="+code+"&__act=__id.24.TOEFLAPP.appadp.actLogin&submit.x=27&submit.y=6";

        var options = {
            hostname: 'toefl.etest.net.cn',
            port: 80,
            path: "/cn/TOEFLAPP",
            method: 'POST',
            headers:{
                'Cookie': 'WebBrokerSessionID=' + sessionId,
                "Content-Length": Buffer.byteLength(postData, 'utf8'),
                "Content-Type": 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3'
            }
        };

        var req_http = http.request(options);

        req_http.on('response', function(res_http) {
            var chunks = [];
            res_http.on('data', function(chunk) {
                chunks.push(chunk);
            });
            res_http.on('end', function() {
//                var decodedBody = iconv.decode(Buffer.concat(chunks), 'gb2312');
//                console.log(decodedBody);
                if (res_http.statusCode == 200) {
                    sessionStatus = Date.now();
                    got.resolve();
                } else {
                    got.reject({message: "status code: " + res_http.statusCode + ", service not available"});
                }
            });
        });

        req_http.on('error', function(error) {
            got.reject(error);
        });

        req_http.write(postData);
        req_http.end();

        when(got.promise).then(function () {
            delete req.wxsession.codeFlag;
            res.reply("亲，登陆成功");
        }).catch(function (error) {
            res.reply(error.message);
        });
    },

    query: function (info, req, res) {
        var seed = Date.now() + Math.random(),
            got = when.defer();

        request.get({
            url: "http://toefl.etest.net.cn/cn/" + seed + ".VerifyCode2.jpg",
            headers:{
                'Cookie': 'WebBrokerSessionID=' + sessionId,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0'
            }
        }, function (error, response) {
            if (!error && response.statusCode == 200) {
                sessionStatus = Date.now();
                got.resolve();
            } else {
                got.reject(error);
            }
        }).pipe(fs.createWriteStream(path.join(codeRoot, 'query.jpg')));

        when(got.promise).then(function () {
            req.wxsession.codeFlag = 2;
            res.reply([
                {
                    title: '查询验证码',
                    description: '回复此验证码内容以查询考位',
                    picurl: 'http://toefl.candylee.cn/code/query.jpg?'+Math.random(),
                    url: 'http://toefl.candylee.cn/code/query.jpg'
                }
            ]);
        }).catch(function (error) {
            res.reply(error.message);
        });
    },

    handleQuery: function (info, req, res) {
        // http://toefl.etest.net.cn/cn/SeatsQuery?mvfAdminMonths=201408&mvfAdminMonths=201409&mvfSiteProvinces=Beijing&mvfSiteProvinces=Shandong&mvfSiteProvinces=Liaoning&whichFirst=AS&afCalcResult=?&__act=__id.22.SeatsQuery.adp.actList&submit.x=24&submit.y=14
        var code = info.Content,
            got = when.defer();

        request.get({
            url: "http://toefl.etest.net.cn/en/SeatsQuery?mvfAdminMonths=201408&mvfAdminMonths=201409&mvfAdminMonths=201410&mvfSiteProvinces=Beijing&mvfSiteProvinces=Shandong&mvfSiteProvinces=Liaoning&whichFirst=AS&afCalcResult="+code+"&__act=__id.22.SeatsQuery.adp.actList&submit.x=24&submit.y=14",
            headers:{
                'Cookie': 'WebBrokerSessionID=' + sessionId,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0'
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                sessionStatus = Date.now();
                got.resolve(body);
            } else {
                got.reject(error);
            }
        }).pipe(fs.createWriteStream(path.join(codeRoot, 'result.html')));

        when(got.promise).then(function (body) {
            return dom.serialize(iconv.decode(new Buffer(body), 'gb2312'));
        }).then(function (ret) {
            delete req.wxsession.codeFlag;
            seatsCache = ret;
            res.reply(dom.formatFree(seatsCache));
            res.reply([
                {
                    title: '考位信息',
                    description: '点击阅读全文查看考位信息',
                    //picurl: 'http://toefl.candylee.cn/images/TOEFL.png',
                    url: 'http://toefl.candylee.cn/code/result.html'
                }
            ]);
        }).catch(function (error) {
            res.reply(error.message);
        });
    }
};

module.exports = seats;
module.exports.sessionId = sessionId;
module.exports.seatsCache = seatsCache;
