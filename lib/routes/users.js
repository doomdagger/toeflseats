var express = require('express');
var request = require('request');
var _ = require('lodash');
var iconv = require('iconv-lite');
var http = require('http');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/login_code', function (req, res) {

    var seed = Date.now() + Math.random();
    request.get("http://toefl.etest.net.cn/cn/"+seed+"VerifyCode3.jpg", function (error, response) {
        if (!error && response.statusCode == 200) {
            var rawHeader = response.headers['set-cookie'] && response.headers['set-cookie'][0],
                sessionId;
            if (rawHeader && _.isString(rawHeader)) {
                sessionId = rawHeader.substring(rawHeader.indexOf('=')+1, rawHeader.indexOf(';'));
                req.session.etsId = sessionId;
            }
        } else {
            res.write("error occurs");
        }
        res.end();
    }).pipe(res, { end: false });

});

router.all('/login', function (req, res) {

    var name = req.param('name') || "3348081",
        pass = req.param('pass') || "Lxy910802",
        code = req.param('code');

    var postData = "username="+name+"&password="+pass+"&LoginCode="+code+"&__act=__id.24.TOEFLAPP.appadp.actLogin&submit.x=27&submit.y=6";

    var options = {
        hostname: 'toefl.etest.net.cn',
        port: 80,
        path: "/cn/TOEFLAPP",
        method: 'POST',
        headers:{
            'Cookie': 'WebBrokerSessionID=' + req.session.etsId,
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
//            var decodedBody = iconv.decode(Buffer.concat(chunks), 'gb2312');
//
//            console.log(decodedBody);
//
//            res.send(decodedBody);
            var seed = Date.now() + Math.random();

            request.get({
                url: "http://toefl.etest.net.cn/cn/" + seed + ".VerifyCode2.jpg",
                headers:{
                    'Cookie': 'WebBrokerSessionID=' + req.session.etsId,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0'
                }
            }, function (error, response) {
                if (error || response.statusCode != 200) {
                    res.write("error occurs");
                }
                res.end();
            }).pipe(res, { end: false });
        });
    });

    req_http.on('error', function(error) {
        res.send(error.message);
    });

    req_http.write(postData);
    req_http.end();

});

router.all("/query", function (req, res) {
    // http://toefl.etest.net.cn/cn/SeatsQuery?mvfAdminMonths=201408&mvfAdminMonths=201409&mvfSiteProvinces=Beijing&mvfSiteProvinces=Shandong&mvfSiteProvinces=Liaoning&whichFirst=AS&afCalcResult=?&__act=__id.22.SeatsQuery.adp.actList&submit.x=24&submit.y=14
    var code = req.param('code');

    request.get({
        url: "http://toefl.etest.net.cn/cn/SeatsQuery?mvfAdminMonths=201408&mvfAdminMonths=201409&mvfAdminMonths=201409&mvfSiteProvinces=Beijing&mvfSiteProvinces=Shandong&mvfSiteProvinces=Liaoning&whichFirst=AS&afCalcResult="+code+"&__act=__id.22.SeatsQuery.adp.actList&submit.x=24&submit.y=14",
        headers:{
            'Cookie': 'WebBrokerSessionID=' + req.session.etsId,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0'
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.write(body);
        } else {
            res.write("error occurs");
        }
        res.end();
    }).pipe(res, { end: false });

});

module.exports = router;
