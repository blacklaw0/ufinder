var Utils = UFinder.Utils = {
    /**
     两个div矩形区域碰撞检测函数，优化后的算法可以检测包含关系，两个参数为jQuery对象
     */
    isOverlap: function (objOne, objTwo) {
        var offsetOne = objOne.offset();
        var offsetTwo = objTwo.offset();
        var x1 = offsetOne.left;
        var y1 = offsetOne.top;
        var x2 = x1 + objOne.width();
        var y2 = y1 + objOne.height();

        var x3 = offsetTwo.left;
        var y3 = offsetTwo.top;
        var x4 = x3 + objTwo.width();
        var y4 = y3 + objTwo.height();

        var zx = Math.abs(x1 + x2 - x3 - x4);
        var x = Math.abs(x1 - x2) + Math.abs(x3 - x4);
        var zy = Math.abs(y1 + y2 - y3 - y4);
        var y = Math.abs(y1 - y2) + Math.abs(y3 - y4);
        return (zx <= x && zy <= y);
    },
    dateFormat: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    argsToArray: function (args, index) {
        return Array.prototype.slice.call(args, index || 0);
    },
    regularDirPath: function (path) {
        return path.replace(/([^\/])$/, '$1/').replace(/^([^\/])/, '/$1');
    },
    getParentPath: function (path) {
        return path.replace(/[^\/]+\/?$/, '');
    },
    getPathExt: function (path) {
        var index = path.lastIndexOf('.');
        return path.substr((index == -1 ? path.length : index) + 1);
    },
    isImagePath: function (path) {
        return path && 'png gif bmp jpg jpeg'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    isCodePath: function (path) {
        return path && 'txt md json js css html htm xml php asp jsp'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    isWebPagePath: function (path) {
        return path && 'html php asp jsp'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    extend: function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },
    clone: function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = Utils.isArray(tmp) ? [] : {};
                    Utils.clone(source[i], target[i]);
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },
    loadFile: (function () {
        var tmpList = [];

        function getItem(doc, obj) {
            try {
                for (var i = 0, ci; ci = tmpList[i++];) {
                    if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                        return ci;
                    }
                }
            } catch (e) {
                return null;
            }

        }

        return function (doc, obj, fn) {
            var p, item = getItem(doc, obj);
            if (item) {
                if (item.ready) {
                    fn && fn();
                } else {
                    item.funs.push(fn);
                }
                return;
            }
            tmpList.push({
                doc: doc,
                url: obj.src || obj.href,
                funs: [fn]
            });
            if (!doc.body) {
                var html = [];
                for (p in obj) {
                    if (p == 'tag')continue;
                    html.push(p + '="' + obj[p] + '"');
                }
                doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
                return;
            }
            if (obj.id && doc.getElementById(obj.id)) {
                return;
            }
            var element = doc.createElement(obj.tag);
            delete obj.tag;
            for (p in obj) {
                element.setAttribute(p, obj[p]);
            }
            element.onload = element.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    item = getItem(doc, obj);
                    if (item.funs.length > 0) {
                        item.ready = 1;
                        for (var fi; fi = item.funs.pop();) {
                            fi();
                        }
                    }
                    element.onload = element.onreadystatechange = null;
                }
            };
            element.onerror = function () {
                throw new Error('The load ' + (obj.href || obj.src) + ' fails,check the url');
            };
            doc.getElementsByTagName("head")[0].appendChild(element);
        };
    })()
};

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Boolean'], function (k, v) {
    Utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    };
});