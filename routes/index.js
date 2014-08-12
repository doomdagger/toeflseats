var express = require('express');
var crypto = require('crypto');
var router = express.Router();

var checkHash = function (signature, timestamp, nonce) {
    var token = "ILoveYou",
        tmpArr = [token, timestamp, nonce],
        tmpStr;

    tmpArr.sort();
    tmpStr = tmpArr.join("");

    var shasum = crypto.createHash('sha1');

    shasum.update(tmpStr);
    tmpStr = shasum.digest('hex');

    return signature !== "" && tmpStr == signature;
};

/* GET home page. */
router.get('/', function(req, res) {

    var signature = req.param("signature") || "",
        timestamp = req.param("timestamp") || "",
        nonce = req.param("nonce") || "",
        echostr = req.param("echostr") || "";


    if ( checkHash(signature, timestamp, nonce) ){
        res.send(echostr);
    }else{
        res.send("Invalid Request");
    }

});

router.post('/', function(req, res) {
    var signature = req.param("signature") || "",
        timestamp = req.param("timestamp") || "",
        nonce = req.param("nonce") || "";

    console.log(req.body);

    if ( checkHash(signature, timestamp, nonce) ){
        res.send("true");
    }else{
        res.send("Invalid Request");
    }
});

module.exports = router;
