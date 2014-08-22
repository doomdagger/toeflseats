/**
 * Created by lihe9_000 on 2014/8/23.
 */

var api    = require('./api'),
    wechat = require('wechat'),
//    API = wechat.API,
//    wechatapi = new API('appid', 'secret'),
    when   = require('when'),
    List   = wechat.List;

module.exports = function () {
    var prepared = when.defer();

    List.add('demo', [
        ['回复{a}查看我的性别', api.demo.sex],
        ['回复{b}查看我的年龄', api.demo.age],
        ['回复{c}查看我的性取向', api.demo.sexuality]
    ]);

    List.add('1222', [
        ['回复{1}获取登陆验证码', api.seats.login],
        ['回复{2}获取查询验证码', api.seats.query]
    ]);

//    wechat.createMenu({
//        "button":[
//            {
//                "type":"click",
//                "name":"考位快报",
//                "key":"V1001_SEATS_BRIEF"
//            },
//            {
//                "type":"view",
//                "name":"考位详单",
//                "url":"http://toefl.candylee.cn/code/result.html"
//            }]
//    }, function (err, result) {
//        if (err) {
//            prepared.reject(err);
//            return;
//        }
//
//        prepared.resolve(result);
//    });

    return prepared.promise;
};
