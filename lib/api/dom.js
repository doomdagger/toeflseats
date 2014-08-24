/**
 * Created by lihe9_000 on 2014/8/23.
 */
var jsdom = require('jsdom'),
    when  = require('when'),
    _     = require('lodash'),
    fs    = require('fs'),
    iconv = require('iconv-lite'),
    jquery= require('jquery'),

    dom;

dom = {

    readHtml: function (path) {
        var read = when.defer();
        fs.readFile(path, function (err, data) {
            if (err) {
                read.reject(err);
                return;
            }
            read.resolve(iconv.decode(data, 'gb2312'));
        });

        return read.promise;
    },

    serialize: function (html) {
        var rootKeys = [],
            rootValues = [],
            rootObj = {},
            ready = when.defer();

        jsdom.env(html, function (errors, window) {
            if (errors) {
                ready.reject(errors);
                return;
            }
            var $ = jquery(window);

            //noinspection JSJQueryEfficiency
            $('#maincontent table[cellpadding="3"]').each(function () {
                var tempKey = '';
                $(this).contents().find("b").each(function () {
                    tempKey += $(this).text() + ' ';
                });
                rootKeys.push(tempKey.trim());
            });

            //noinspection JSJQueryEfficiency
            $('#maincontent table[cellpadding="4"]').each(function () {
                var tempObj = {},
                    tempArr = [],
                    tempKey = '';
                $(this).children("tr").each(function () {
                    if ($(this).attr('bgcolor') === '#E0E0E0') {
                        // 2014年11月2日 09:00
                        tempKey = $(this).contents().find('b').text().split(' ')[0];
                        tempArr = [];
                        tempObj[tempKey] = tempArr;
                    } else if ($(this).attr('bgcolor') === '#CCCCCC') {
                        var domArr = $(this).children('td');
                        tempArr.push({
                            "center_id": $(domArr[1]).text(),
                            "center_name": $(domArr[2]).text(),
                            "center_fee": $(domArr[3]).text(),
                            "available": $(domArr[4]).text().trim() === '有名额', //'Seat available'
                            "timestamp": Date.now()
                        });
                    }
                });
                rootValues.push(tempObj);
            });

            if(rootKeys.length !== rootValues.length) {
                ready.reject({message: "length of key does not equal to length of value!"})
            } else {
                for (var i = 0; i < rootKeys.length; i++) {
                    rootObj[rootKeys[i]] = rootValues[i];
                }
                ready.resolve(rootObj);
            }

        });

        return ready.promise;
    },

    formatFree: function (serialized) {
        var frees = [];
        for (var key in serialized) {
            if (serialized.hasOwnProperty(key)) {
                // 2014年 十一月 辽宁
                var root = key.split(' ')[2];
                for (var subkey in serialized[key]) {
                    if (serialized[key].hasOwnProperty(subkey)) {
                        // 2014年11与2日 09:00
                        var subroot = subkey.substring(0, subkey.lastIndexOf(' ')),
                            arr = serialized[key][subkey];
                        for(var i = 0; i < arr.length; i++) {
                            if(arr[i]['available']) {
                                frees.push([root, subroot, arr[i]['center_id'], arr[i]['center_name'], Math.floor((Date.now() - arr[i]['timestamp'])/1000) + '秒前'].join(' '));
                            }
                        }

                    }
                }
            }
        }
        return frees.join('\n');
    },

    'test': function () {
        var path = require('path');

        return dom.readHtml(path.resolve(__dirname, '../public/code/result.html'))
            .then(function (html) {
                return dom.serialize(html);
            });
    }
};

//dom.test().then(function (ret) {
//    console.log(dom.formatFree(ret));
//}).catch(function (err) {
//    throw err;
//});

module.exports = dom;
