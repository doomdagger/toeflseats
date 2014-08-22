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


router.all('/login', function (req, res) {


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
