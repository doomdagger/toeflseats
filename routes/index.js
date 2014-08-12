var express = require('express');
var crypto = require('crypto');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

    var signature = req.param("signature") || "",
        timestamp = req.param("timestamp") || "",
        nonce = req.param("nonce") || "",
        echostr = req.param("echostr") || "";

    var token = "ILoveYou",
        tmpArr = [token, timestamp, nonce],
        tmpStr;

    tmpArr.sort();
    tmpStr = tmpArr.join("");

    var shasum = crypto.createHash('sha1');

    shasum.update(tmpStr);
    tmpStr = shasum.digest();

    console.log(tmpStr);
    console.log(echostr);

    if ( signature !== "" && tmpStr == signature ){
        res.send(echostr);
    }else{
        res.send("Invalid Request");
    }

});

module.exports = router;
