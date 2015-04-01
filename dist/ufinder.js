/*!
 * ====================================================
 * ufinder - v1.0.0 - 2015-04-01
 * https://github.com/fex-team/ufinder
 * GitHub: https://github.com/fex-team/ufinder.git 
 * Copyright (c) 2015 f-cube @ FEX; Licensed MIT
 * ====================================================
 */

(function($, window) {

var UFinder =
    window.UF =
        window.UFinder = function () {
            var instanceMap = {}, instanceId = 0;
            return {
                version: '1.0.0',
                createFinder: function (renderTarget, options) {
                    options = options || {};
                    options.renderTo = Utils.isString(renderTarget) ? document.getElementById(renderTarget) : renderTarget;
                    var finder = new Finder(options);
                    this.addFinder(options.renderTo, finder);
                    return finder;
                },
                addFinder: function (target, finder) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    instanceMap[id] = finder;
                },
                getFinder: function (target, options) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    return instanceMap[id] || this.createFinder(target, options);
                },
                //挂接多语言
                LANG: {}
            };
        }();

var browser = UF.browser = function () {
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
            /**
             * 检测浏览器是否为IE
             * @name ie
             * @grammar UM.browser.ie  => true|false
             */
            ie: !!window.ActiveXObject,

            /**
             * 检测浏览器是否为Opera
             * @name opera
             * @grammar UM.browser.opera  => true|false
             */
            opera: ( !!opera && opera.version ),

            /**
             * 检测浏览器是否为webkit内核
             * @name webkit
             * @grammar UM.browser.webkit  => true|false
             */
            webkit: ( agent.indexOf(' applewebkit/') > -1 ),

            /**
             * 检测浏览器是否为mac系统下的浏览器
             * @name mac
             * @grammar UM.browser.mac  => true|false
             */
            mac: ( agent.indexOf('macintosh') > -1 ),

            /**
             * 检测浏览器是否处于怪异模式
             * @name quirks
             * @grammar UM.browser.quirks  => true|false
             */
            quirks: ( document.compatMode == 'BackCompat' )
        };
    /**
     * 检测浏览器是否处为gecko内核
     * @name gecko
     * @grammar UM.browser.gecko  => true|false
     */
    browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

    var version = 0;

    // Internet Explorer 6.0+
    if (browser.ie) {
        version = parseFloat(agent.match(/msie (\d+)/)[1]);
        /**
         * 检测浏览器是否为 IE9 模式
         * @name ie9Compat
         * @grammar UM.browser.ie9Compat  => true|false
         */
        browser.ie9Compat = document.documentMode == 9;
        /**
         * 检测浏览器是否为 IE8 浏览器
         * @name ie8
         * @grammar     UM.browser.ie8  => true|false
         */
        browser.ie8 = !!document.documentMode;

        /**
         * 检测浏览器是否为 IE8 模式
         * @name ie8Compat
         * @grammar     UM.browser.ie8Compat  => true|false
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name ie7Compat
         * @grammar     UM.browser.ie7Compat  => true|false
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
        || document.documentMode == 7 );

        /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name ie6Compat
         * @grammar     UM.browser.ie6Compat  => true|false
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

        browser.ie9above = version > 8;

        browser.ie9below = version < 9;
    }

    // Gecko.
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split('.');
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }
    /**
     * 检测浏览器是否为chrome
     * @name chrome
     * @grammar     UM.browser.chrome  => true|false
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = +RegExp['\x241'];
    }
    /**
     * 检测浏览器是否为safari
     * @name safari
     * @grammar     UM.browser.safari  => true|false
     */
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if (browser.opera)
        version = parseFloat(opera.version());

    // WebKit 522+ (Safari 3+)
    if (browser.webkit)
        version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);

    /**
     * 浏览器版本判断
     * IE系列返回值为5,6,7,8,9,10等
     * gecko系列会返回10900，158900等.
     * webkit系列会返回其build号 (如 522等).
     * @name version
     * @grammar     UM.browser.version  => number
     * @example
     * if ( UM.browser.ie && UM.browser.version == 6 ){
     *     alert( "Ouch!居然是万恶的IE6!" );
     * }
     */
    browser.version = version;

    /**
     * 是否是兼容模式的浏览器
     * @name isCompatible
     * @grammar  UM.browser.isCompatible  => true|false
     * @example
     * if ( UM.browser.isCompatible ){
     *     alert( "你的浏览器相当不错哦！" );
     * }
     */
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;

//这里只放不是由模块产生的默认参数
UF.defaultOptions = {
    zIndex: 10,
    lang: 'zh-cn'
};


//模块注册&暴露模块接口
(function () {
    var _modules;
    UF.registerModule = function (name, module) {
        //初始化模块列表
        if (!_modules) {
            _modules = {};
        }
        _modules[name] = module;
    };
    UF.getModules = function () {
        return _modules;
    };
})();

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

/**
 * @description 创建一个类
 * @param {String}    fullClassName  类全名，包括命名空间。
 * @param {Plain}     defines        要创建的类的特性
 *     defines.constructor  {Function}       类的构造函数，实例化的时候会被调用。
 *     defines.base         {String}         基类的名称。名称要使用全名。（因为base是javascript未来保留字，所以不用base）
 *     defines.mixin        {Array<String>}  要混合到新类的类集合
 *     defines.<method>     {Function}       其他类方法
 *
 * TODO:
 *     Mixin 构造函数调用支持
 */
(function () {

    var debug = true;

    // just to bind context
    Function.prototype.bind = Function.prototype.bind || function (thisObj) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.apply(thisObj, args);
    };

    // 方便调试查看
    if (debug) {
        var origin = Object.prototype.toString;
        Object.prototype.toString = function () {
            return this.__UFinderClassName || origin.call(this);
        };
    }

    // 所有类的基类
    function Class() {
    }

    Class.__UFinderClassName = 'Class';

    function getCallerClass(instance, caller) {
        var currentClass = instance.constructor;
    }

    // 提供 base 调用支持
    Class.prototype.base = function (name) {
        var caller = arguments.callee.caller;
        var method = caller.__UFinderMethodClass.__UFinderBaseClass.prototype[name];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };

    // 直接调用 base 类的同名方法
    Class.prototype.callBase = function () {
        var caller = arguments.callee.caller;
        var method = caller.__UFinderMethodClass.__UFinderBaseClass.prototype[caller.__UFinderMethodName];
        return method.apply(this, arguments);
    };

    Class.prototype.mixin = function (name) {
        var caller = arguments.callee.caller;
        var mixins = caller.__UFinderMethodClass.__UFinderMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[name];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };

    Class.prototype.callMixin = function () {
        var caller = arguments.callee.caller;
        var methodName = caller.__UFinderMethodName;
        var mixins = caller.__UFinderMethodClass.__UFinderMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[methodName];
        if (methodName == 'constructor') {
            for (var i = 0, l = method.length; i < l; i++) {
                method[i].call(this);
            }
            return this;
        } else {
            return method.apply(this, arguments);
        }
    };

    Class.prototype.pipe = function (fn) {
        if (typeof ( fn ) == 'function') {
            fn.call(this, this);
        }
        return this;
    };

    Class.prototype.getType = function () {
        return this.__UFinderClassName;
    };

    // 检查基类是否调用了父类的构造函数
    // 该检查是弱检查，假如调用的代码被注释了，同样能检查成功（这个特性可用于知道建议调用，但是出于某些原因不想调用的情况）
    function checkBaseConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callBase/.test(code)) {
            throw new Error(classname + ' : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数');
        }
    }

    function checkMixinConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callMixin/.test(code)) {
            throw new Error(classname + ' : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数');
        }
    }

    var FINDER_INHERIT_FLAG = '__FINDER_INHERIT_FLAG_' + ( +new Date() );

    function inherit(constructor, BaseClass, classname) {
        var UFinderClass = eval('(function UFinder' + classname + '( __inherit__flag ) {' +
        'if( __inherit__flag != FINDER_INHERIT_FLAG ) {' +
        'UFinderClass.__UFinderConstructor.apply(this, arguments);' +
        '}' +
        'this.__UFinderClassName = UFinderClass.__UFinderClassName;' +
        '})');
        UFinderClass.__UFinderConstructor = constructor;

        UFinderClass.prototype = new BaseClass(FINDER_INHERIT_FLAG);

        for (var methodName in BaseClass.prototype) {
            if (BaseClass.prototype.hasOwnProperty(methodName) && methodName.indexOf('__UFinder') !== 0) {
                UFinderClass.prototype[methodName] = BaseClass.prototype[methodName];
            }
        }

        UFinderClass.prototype.constructor = UFinderClass;

        return UFinderClass;
    }

    function mixin(NewClass, mixins) {
        if (false === mixins instanceof Array) {
            return NewClass;
        }

        var i, length = mixins.length,
            proto, method;

        NewClass.__UFinderMixins = {
            constructor: []
        };

        for (i = 0; i < length; i++) {
            proto = mixins[i].prototype;

            for (method in proto) {
                if (false === proto.hasOwnProperty(method) || method.indexOf('__UFinder') === 0) {
                    continue;
                }
                if (method === 'constructor') {
                    // constructor 特殊处理
                    NewClass.__UFinderMixins.constructor.push(proto[method]);
                } else {
                    NewClass.prototype[method] = NewClass.__UFinderMixins[method] = proto[method];
                }
            }
        }

        return NewClass;
    }

    function extend(BaseClass, extension) {
        if (extension.__UFinderClassName) {
            extension = extension.prototype;
        }
        for (var methodName in extension) {
            if (extension.hasOwnProperty(methodName) &&
                methodName.indexOf('__UFinder') &&
                methodName != 'constructor') {
                var method = BaseClass.prototype[methodName] = extension[methodName];
                method.__UFinderMethodClass = BaseClass;
                method.__UFinderMethodName = methodName;
            }
        }
        return BaseClass;
    }

    UF.createClass = function (classname, defines) {
        var constructor, NewClass, BaseClass;

        if (arguments.length === 1) {
            defines = arguments[0];
            classname = 'AnonymousClass';
        }

        BaseClass = defines.base || Class;

        if (defines.hasOwnProperty('constructor')) {
            constructor = defines.constructor;
            if (BaseClass != Class) {
                checkBaseConstructorCall(constructor, classname);
            }
        } else {
            constructor = function () {
                this.callBase.apply(this, arguments);
                this.callMixin.apply(this, arguments);
            };
        }

        NewClass = inherit(constructor, BaseClass, classname);
        NewClass = mixin(NewClass, defines.mixins);

        NewClass.__UFinderClassName = constructor.__UFinderClassName = classname;
        NewClass.__UFinderBaseClass = constructor.__UFinderBaseClass = BaseClass;

        NewClass.__UFinderMethodNames = constructor.__UFinderMethodName = 'constructor';
        NewClass.__UFinderMethodClass = constructor.__UFinderMethodClass = NewClass;

        // 下面这些不需要拷贝到原型链上
        delete defines.mixins;
        delete defines.constructor;
        delete defines.base;

        NewClass = extend(NewClass, defines);

        return NewClass;
    };

    UF.extendClass = extend;

})();


var FileNode = UF.FileNode = UF.createClass("FileNode", {
    constructor: function (info) {
        this.info = {};
        this.parent = null;
        this.locked = false;
        this.children = [];
        this.setInfo(info);
    },
    setInfo: function (info) {
        var me = this,
            attrs = [
                'path', 'name', 'type', 'read', 'write', 'time', 'mode', 'size'
            ];
        $.each(attrs, function (i, attr) {
            info[attr] && me.setAttr(attr, info[attr]);
        });
        this._regularDirPath();
    },
    _regularDirPath: function () {
        var path = this.info['path'].replace(/^([^\/])/, '/$1');
        if (this.getAttr('type') == 'dir') {
            this.info['path'] = path.replace(/([^\/])$/, '$1/');
        } else {
            this.info['path'] = path.replace(/([^\/])$/, '$1');
        }
    },
    getInfo: function () {
        return this.info;
    },
    setAttr: function (key, value) {
        this.info[key] = value;
        this._regularDirPath();
    },
    getAttr: function (key) {
        return this.info[key];
    },
    addChild: function (file) {
        file.parent = this;
        this.children.push(file);
    },
    remove: function () {
        this.parent && this.parent.removeChild(this);
    },
    removeChild: function (file) {
        file.parent = this;
        this.children.pop(file);
    },
    getChild: function (filename) {
        for (var key in this.children) {
            if (this.children[key].getAttr('name') == filename) {
                return this.children[key];
            }
        }
        return null;
    },
    lock: function () {
        this.locked = true;
    },
    unLock: function () {
        this.locked = false;
    }
});


var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._options = $.extend({}, options, window.UFINDER_CONFIG);
        this.setDefaultOptions(UF.defaultOptions);
        this._initEvents();
        this._initSelection();
        this._initFinder();
        this._initShortcutKey();
        this._initModules();

        this.fire('finderready');
    },
    _initFinder: function () {
        this.dataTree = new DataTree(this);
        this.proxy = new Proxy(this);
        this.isFocused = false;
        this.serverOption = {
            realRootUrl: this.getOption('realUrl')
        };
        this.setCurrentPath('/');
    },
    getCurrentPath: function () {
        return this._currentPath;
    },
    setCurrentPath: function (path) {
        path.charAt(0) != '/' && (path = '/' + path);
        path.charAt(path.length - 1) != '/' && (path = path + '/');
        this._currentPath = path;
        this.fire('currentpathchange', this._currentPath);
    },
    setDefaultOptions: function (key, val) {
        var obj = {};
        if (Utils.isString(key)) {
            obj[key] = val;
        } else {
            obj = key;
        }
        $.extend(this._options, obj, $.extend({}, this._options));
    },
    getOption: function (key) {
        return this._options[key];
    },
    getLang: function (path) {
        var lang = UF.LANG[this.getOption('lang')];
        if (!lang) {
            throw new Error("not import language file");
        }
        path = (path || "").split(".");
        for (var i = 0, ci; ci = path[i++];) {
            lang = lang[ci];
            if (!lang)break;
        }
        return lang;
    },
    getRealPath: function (path) {
        return (this.serverOption.realRootUrl + path).replace(/([^:])\/\//g, '$1/');
    }
});


UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};
    },
    _initDomEvent: function () {
        var me = this,
            $container = me.$container,
            $keyListener = $('<input class="ufui-key-listener">');

        $container.append($('<div class="ufui-event-helper" style="position:absolute;left:0;top:0;height:0;width:0;overflow: hidden;"></div>').append($keyListener));
        me._proxyDomEvent = $.proxy(me._proxyDomEvent, me);

        /* 点击事件触发隐藏域聚焦,用于捕获键盘事件 */
        me._initKeyListener($container, $keyListener);

        /* 键盘事件 */
        $(document).on('keydown keyup keypress', me._proxyDomEvent);

        /* 鼠标事件 */
        $container.on('click mousedown mouseup mousemove mouseover mouseout contextmenu selectstart', me._proxyDomEvent);

    },
    _proxyDomEvent: function (evt) {
        var me = this;
        if (evt.originalEvent) {
            var $target = $(evt.originalEvent.target);
            /* 同时触发 tree.click 等事件 */
            $.each(['tree', 'list', 'toolbar'], function (k, p) {
                if ($target[0] == me['$' + p][0] || $target.parents('.ufui-' + p)[0] == me['$' + p][0]) {
                    me.fire(p + '.' + evt.type.replace(/^on/, ''), evt);
                }
            });
        }
        return this.fire(evt.type.replace(/^on/, ''), evt);
    },
    _initKeyListener: function ($container, $keyListener) {
        var me = this;
        /* 点击让ufinder获得焦点,帮助获取键盘事件 */
        $container.on('click', function (evt) {
            var target = evt.target;

            if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' &&
                target.contentEditable != true) {
                // console.log('ufinder focus');
                $keyListener.focus();
                me.isFocused == false && me.setFocus();

            }
        });
        /* 点击document除掉当前ufinder的位置,让ufinder失去焦点 */
        $(document).on('click', function (evt) {
            /* 忽略代码触发的点击事件 */
            if (evt.originalEvent) {
                var $ufContainer = $(evt.originalEvent.target).parents('.ufui-container');
                // TODO: 菜单需要组织到 UFinder container 中

                if ($(evt.originalEvent.target).parents(".context-menu-list").length == 0 && $ufContainer[0] != $container[0]) {
                    $keyListener.blur();
                    me.isFocused == true && me.setBlur();
                }
            }
        });
        me.on('afterexeccommand', function (type, cmd) {
            if (['rename', 'touch', 'mkdir', 'search', 'searchindex'].indexOf(cmd) == -1) {
                $keyListener.focus();
            }
        });
    },
    setFocus: function () {
        this.isFocused = true;
        this.fire('focus');
    },
    setBlur: function () {
        this.isFocused = false;
        this.fire('blur');
    },
    _listen: function (type, callback) {
        var callbacks = this._eventCallbacks[type] || ( this._eventCallbacks[type] = [] );
        callbacks.push(callback);
    },
    on: function (name, callback) {
        var types = name.split(' ');
        for (var i = 0; i < types.length; i++) {
            this._listen(types[i].toLowerCase(), callback);
        }
        return this;
    },
    one: function (name, callback) {
        var me = this,
            handler = function () {
                callback();
                me.off(name, handler);
            };

        me.on(name, handler);
        return this;
    },
    off: function (name, callback) {
        var types = name.split(' ');
        var i, j, callbacks, removeIndex;
        for (i = 0; i < types.length; i++) {
            callbacks = this._eventCallbacks[types[i].toLowerCase()];
            if (callbacks) {
                removeIndex = null;
                for (j = 0; j < callbacks.length; j++) {
                    if (callbacks[j] == callback) {
                        removeIndex = j;
                    }
                }
                if (removeIndex !== null) {
                    callbacks.splice(removeIndex, 1);
                }
            }
        }
    },
    fire: function (type) {
        var callbacks = this._eventCallbacks[type.toLowerCase()];
        if (!callbacks) {
            return;
        }
        for (var i = 0; i < callbacks.length; i++) {
            var res = callbacks[i].apply(this, arguments);
            if (res == false) {
                break;
            }
        }
        return res;
    }
});


UF.extendClass(Finder, {
    _initShortcutKey: function () {
        this._shortcutkeys = {};
    },
    addShortcutKeys: function (cmd, keys) {
        var obj = {};
        if (keys) {
            obj[cmd] = keys;
        } else {
            obj = cmd;
        }
        $.extend(this._shortcutkeys, obj);

        //this._bindshortcutKeys();
    },
    _bindshortcutKeys: function () {
        var me = this,
            shortcutkeys = me._shortcutkeys;
        me.on('keydown', function (type, e) {
            // 编辑状态中, 快捷键不可用
            if ($(e.target).attr('contentEditable') == "true" || $(e.target).attr("type") == "text") return true;
            var keyCode = e.keyCode || e.which;
            console.log(e.keyCode);

            for (var i in shortcutkeys) {
                var tmp = shortcutkeys[i].split(',');
                for (var t = 0, ti; ti = tmp[t++];) {
                    ti = ti.split(':');
                    var key = ti[0],
                        param = ti[1];
                    if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                        if (( ( RegExp.$1 == 'ctrl' ? ( e.ctrlKey || e.metaKey ) : 0 ) && ( RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1 ) && keyCode == RegExp.$3 ) ||
                            keyCode == RegExp.$1
                        ) {
                            if (me.queryCommandState(i, param) != -1) {
                                me.execCommand(i, param);
                            }
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    }
});



UF.extendClass(Finder, {
    _initSelection: function () {
        this._selectedFiles = [];
    },
    //提供接口给command获取选区实例
    getSelection: function () {
        return new Selection(this);
    },
    //提供接口给adapter获取选区实例
    setSelectedFiles: function (paths) {
        this._selectedFiles = $.isArray(paths) ? paths : [paths];
        this.fire('selectionchange');
    }
});

UF.extendClass(Finder, {
    _initModules: function () {

        var modulesPool = UF.getModules();

        this._commands = {};
        this._query = {};
        this._modules = {};

        var me = this,
            i, name, module, moduleDeals, dealCommands, dealEvents;

        for (name in modulesPool) {
            if (!modulesPool.hasOwnProperty(name)) continue;

            //执行模块初始化，抛出后续处理对象
            moduleDeals = modulesPool[name].call(me);
            this._modules[name] = moduleDeals;
            if (moduleDeals.init) {
                moduleDeals.init.call(me, this._options);
            }

            //command加入命令池子
            dealCommands = moduleDeals.commands;
            for (var cmd in dealCommands) {
                me._commands[cmd.toLowerCase()] = dealCommands[cmd];
            }

            //设置模块默认配置项
            if (moduleDeals.defaultOptions) {
                me.setDefaultOptions(moduleDeals.defaultOptions);
            }

            //绑定事件
            dealEvents = moduleDeals.events;
            if (dealEvents) {
                for (var type in dealEvents) {
                    me.on(type, dealEvents[type]);
                }
            }

            //添加模块的快捷键
            if (moduleDeals.shortcutKeys) {

                me.addShortcutKeys(moduleDeals.shortcutKeys);
            }

        }
        this._bindshortcutKeys();
    }
});


UF.extendClass(Finder, {
    _getCommand: function (name) {
        return this._commands[name.toLowerCase()];
    },
    _queryCommand: function (name, type, args) {
        var cmd = this._getCommand(name);
        if (cmd) {
            var queryCmd = cmd['query' + type];
            if (queryCmd)
                return queryCmd.apply(cmd, [this].concat(args));
        }
        return 0;
    },
    queryCommandState: function (name) {
        if (!this.isFocused) return -1;
        return this._queryCommand(name, "State", Utils.argsToArray(1));
    },
    queryCommandValue: function (name) {
        return this._queryCommand(name, "Value", Utils.argsToArray(1));
    },
    execCommand: function (name) {
        name = name.toLowerCase();

        var cmdArgs = $.makeArray(arguments).slice(1),
            cmd, result;

        var me = this;
        cmd = this._getCommand(name);

        if (!cmd) {
            return false;
        }

        me.fire('beforeexeccommand', name);
        result = cmd.execute.apply(me, cmdArgs);
        me.fire('afterexeccommand', name);
        //if (name == "search") aa;

        return result === undefined ? null : result;
    }
});


var Selection = UF.Selection = UF.createClass("Selection", {
    constructor: function (finder) {
        this.finder = finder;
        this._selectedFiles = finder._selectedFiles || [];
    },
    getSelectedFile: function () {
        return this._selectedFiles[0];
    },
    getSelectedFiles: function () {
        return this._selectedFiles;
    },
    removeSelectedFiles: function (paths) {
        var me = this;
        $.each($.isArray(paths) ? paths : [paths], function (i, p) {
            var index;
            if (( index = me._selectedFiles.indexOf(p) ) === -1) return;
            me._selectedFiles.splice(index, 1);
        });
    },
    removeAllSelectedFiles: function () {
        this._selectedFiles = [];
    },
    isFileSelected: function (path) {
        return this._selectedFiles.indexOf(path) !== -1;
    },
    select: function () {
        this.finder.fire('selectfiles', this._selectedFiles);
    }
});


/**
 * 存放所有文件的树形结构体
 * @class UF.DataTree
 * @constructor
 */
var DataTree = UF.DataTree = UF.createClass("DataTree", {

    /**
     * 创建 DataTree 实例
     * @constructor
     * @param { UF.Finder } finder - 绑定的 finder 实例
     */
    constructor: function (finder) {
        this.finder = finder;
        this.root = null;
    },

    /**
     * 创建 DataTree 实例
     * @method 设置跟节点
     * @param { Object } data 跟节点的 FileNode 内容
     */
    setRoot: function (data) {
        this.root = new FileNode(data);
        this.finder.fire('dataReady', data);
    },
    // 无缓存数据时记录最近的路径供递归open用
    getNearestNode: function (path) {
        var current = this.root,
            pathArr = path.split('/');
        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            if (name != '') {
                var p = current;
                current = current.getChild(name);
                if (current == null) {
                    return p.getInfo().path;
                }
            }
        }
        return path;
    },
    _getFileNode: function (path) {
        var current = this.root,
            pathArr = path.split('/');
        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            if (name != '') {
                var p = current;
                current = current.getChild(name);
                if (current == null) {
                    return current;
                }
            }
        }
        return current;
    },

    /**
     * 创建 DataTree 实例
     * @method 设置跟节点
     * @param { Object } data 跟节点的 FileNode 内容
     */
    getFileInfo: function (path) {
        var info = this._getFileNode(path);
        return info ? info.getInfo() : null;
    },
    _addFile: function (data) {
        var current = this.root,
            pathArr = $.trim(data.path).replace(/(^\/)|(\/$)/g, '').split('/');

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            if (name != '') {
                current = current.getChild(name);
            }
        }
        current && current.addChild(new FileNode(data));
    },
    addFile: function (data) {
        this._addFile(data);
        this.finder.fire('addFiles', data);
    },
    updateFile: function (path, data) {
        var file = this._getFileNode(path);
        if (file.path == path) {
            file.setInfo(data);
        } else {
            file.remove();
            this._addFile(data);
        }
        this.finder.fire('updateFile', path, data);
    },
    removeFile: function (path) {
        var file = this._getFileNode(path);
        file && file.remove();
        this.finder.fire('removeFiles', path);
    },
    addFiles: function (datas) {
        var me = this;

        $.each(datas, function (key, data) {
            me.addFile(data);
        });
    },
    removeFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.removeFile(path);
        });
    },
    lockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.lock();
        this.finder.fire('lockfiles', [path]);
    },
    unLockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.unLock();
        this.finder.fire('unlockfiles', [path]);
    },
    lockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.lockFile(path);
        });
    },
    unLockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.unLockFile(path);
        });
    },
    listDirFileInfo: function (path) {
        var filelist = [],
            dir = this._getFileNode(path);
        if (dir == null) {
            return null;
        }
        $.each(dir.children, function (k, v) {
            filelist.push(v.getInfo());
        });
        return filelist;
    },
    removeDirChilds: function (path) {
        var paths = [], dir = this._getFileNode(path);
        // 目录不存在, 不需要清除缓存
        if (dir == null) return;
        $.each(dir.children, function (k, v) {
            paths.push(v.getInfo()['path']);
        });
        // 状态同步到list
        this.removeFiles(paths);
        dir.children.splice(0, dir.children.length);
    },
    isFileLocked: function (path) {
        return this._getFileNode(path).locked;
    }
});


var Request = UF.Request = UF.createClass("Request", {
    constructor: function (data, callback) {
        this.id = 'r' + (+new Date()).toString(36);
        this.data = data;
        this.jqXhr = null;
        this.callback = callback;
    },
    send: function () {
        var me = this;
        me.jqXhr = $.ajax(me.data).always(function (r) {
            try {
                me.responseJson = JSON ? JSON.parse(r) : eval(r);
            } catch (e) {
                me.responseJson = null;
            }
            me.responseText = r;
            //console.log(me.responseJson || r);
            me.callback && me.callback(me.responseJson);
        });
    },
    abort: function () {
        this.cancel();
    },
    cancel: function () {
        this.jqXhr && this.jqXhr.abort();
    },
    callback: function () {

    }
});


var Uploader = UF.Uploader = UF.createClass("Uploader", {
    constructor: function (data, callback) {
        this.id = 'r' + (+new Date()).toString(36);
        this.data = data;
        this.webuploader = data.webuploader;
        this.callback = callback;
        this.process = data.process;
        this.file = data.data.file;
        this._initEvents();
    },
    _initEvents: function () {
        var me = this, r,
            handler = function (file) {
                if (file.id == me.file.id) {
                    try {
                        me.responseJson = JSON ? JSON.parse(r) : eval(r);
                    } catch (e) {
                        me.responseJson = null;
                    }
                    me.responseText = r;
                    me.webuploader.stop();
                    me.callback && me.callback(me.responseJson);
                    me.webuploader.off('uploadComplete', handler);
                }
            };

        me.webuploader.on('uploadProgress', function (file, percent) {
            me.process && me.process(percent);
        });
        me.webuploader.on('uploadSuccess', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadError', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadComplete', handler);
    },
    send: function () {
        this.webuploader.option('formdata', {
            cmd: 'upload',
            target: this.data.data.target
        });
        this.webuploader.upload(this.file);
    },
    pause: function () {
        this.webuploader.stop();
    },
    cancel: function () {
        this.webuploader.stop(true);
    }
});


var Proxy = UF.Proxy = UF.createClass("Proxy", {
    constructor: function (finder) {
        this.finder = finder;
        this._queue = [];
        this.active = false;
        this.nextSendIndex = 0;
        this._url = finder.getOption('serverUrl');
    },
    'init': function (callback) {
        return this._get({
            'cmd': 'init'
        }, callback);
    },
    getRequestUrl: function (options) {
        var url = this._url + '?';
        $.each(options || {}, function (k, v) {
            url += (k + '=' + v + '&');
        });
        if (url.charAt(url.length - 1) == '&') url = url.substr(0, url.length - 1);
        if (url.charAt(url.length - 1) == '?') url = url.substr(0, url.length - 1);
        return url;
    },
    'ls': function (target, callback) {
        return this._get({
            'cmd': 'ls',
            'target': target
        }, callback);
    },
    'rename': function (target, name, callback) {
        return this._get({
            'cmd': 'rename',
            'target': target,
            'name': name
        }, callback);
    },
    'touch': function (target, callback) {
        return this._get({
            'cmd': 'touch',
            'target': target
        }, callback);
    },
    'mkdir': function (target, callback) {
        return this._get({
            'cmd': 'mkdir',
            'target': target
        }, callback);
    },
    'rm': function (target, callback) {
        return this._get({
            'cmd': 'rm',
            'target': target
        }, callback);
    },
    'move': function (target, callback) {
        return this._get({
            'cmd': 'mv',
            'target': target
        }, callback);
    },
    'copy': function (target, callback) {
        return this._get({
            'cmd': 'copy',
            'target': target
        }, callback);
    },
    upload: function (target, file, callback) {
        return this._upload({
            'cmd': 'upload',
            'target': target,
            'file': file
        }, callback, file);
    },
    preview: function (target, callback) {
        return this._get({
            'cmd': 'preview',
            'target': target
        }, callback);
    },
    search: function (target, callback) {
        return this._get({
            'cmd': 'search',
            'target': target
        }, callback);
    },
    info: function (target, callback) {
        return this._get({
            'cmd': 'info',
            'target': target
        }, callback);
    },
    _get: function (data, callback) {
        return this._ajax('GET', data, callback);
    },
    _post: function (data, callback) {
        return this._ajax('POST', data, callback);
    },
    _upload: function (data, callback) {
        return this._ajax('UPLOAD', data, callback);
    },
    _ajax: function (type, data, callback) {
        var me = this,
            request,
            handler = function (d) {
                me._beforeRequestComplete(d, request);
                callback && callback(d, request);
                me._afterRequestComplete(d, request);
            };

        if (type == 'UPLOAD') {
            request = new Uploader({
                url: me._url,
                type: type,
                webuploader: me.finder.webuploader,
                data: data,
                process: function (p) {
                    me.finder.fire('updatemessage', {
                        loadedPercent: p,
                        request: request,
                        id: request.id
                    });
                }
            }, handler);
        } else {
            request = new Request({
                url: me._url,
                type: type,
                data: data
            }, handler);
        }

        me._pushRequest(request);
        // 部分指令不需要缓冲进度条
        if (['search', 'preview'].indexOf(data['cmd']) == -1)
            me.finder.fire('showmessage', {
                icon: 'loading',
                title: data.cmd + ' loading...',
                loadedPercent: 100,
                request: request,
                id: request.id
            });

        return request;
    },
    _pushRequest: function (request) {
        this._queue.push(request);
        this._sendRequest();
    },
    _sendRequest: function () {
        if (!this.active && this.nextSendIndex < this._queue.length) {
            this.active = true;
            this._queue[this.nextSendIndex++].send();
        }
    },
    _beforeRequestComplete: function (d, request) {
        this.finder.fire('beforeRequestComplete', d, request);
        this.finder.fire('hidemessage', {id: request.id});
        this.active = false;
        this._sendRequest();
    },
    _afterRequestComplete: function (d, request) {
        this.finder.fire('afterRequestComplete', d, request);
    }
});


UF.registerModule("openmodule", function () {
    var uf = this,
        listFile = function (path, isOpen) {

            if (path === undefined) {
                path = uf.getSelection().getSelectedFile();
            } else if (path == "") {
                path = "/";
            }
            var lastnearest = "";
            // 避免非法path造成的死循环
            var data = uf.dataTree.listDirFileInfo(path),
                openHandler = function (data) {
                    var filelist = (data && data.data && data.data.files) || [];
                    uf.dataTree.addFiles(filelist);
                    var nearest = uf.dataTree.getNearestNode(path);
                    // 一直递归到目的路径
                    if (lastnearest != nearest) {
                        lastnearest = nearest;
                        uf.proxy.ls(nearest, openHandler);
                    } else {
                        isOpen && uf.setCurrentPath(path);
                    }

                };
            // 启用缓存数据
            if (data && data.length) {
                openHandler(data);
            } else {
                // 远程数据
                var lastnearest = uf.dataTree.getNearestNode(path);
                uf.proxy.ls(lastnearest, openHandler);
            }

        },
        queryState = function () {
            var paths, info;
            paths = uf.getSelection().getSelectedFiles();
            if (paths.length == 1) {
                info = uf.dataTree.getFileInfo(paths[0]);
                return info && info.read && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
            } else {
                return -1;
            }
        };

    return {
        "init": function () {

        },
        "defaultOptions": {},
        "commands": {
            "open": {
                execute: function (path) {
                    if (path === undefined) {
                        path = uf.getSelection().getSelectedFile();
                    } else if (path == "") {
                        path = "/";
                    }

                    uf.setSelectedFiles([]);// 避免查询空节点的状态
                    uf.dataTree.removeDirChilds(path),// 清空tree缓存, 强制刷新
                        listFile(path, true);
                },
                queryState: queryState
            },
            "refresh": {
                execute: function () {
                    var uf = this, path = uf.getCurrentPath();
                    // 清空tree缓存
                    uf.dataTree.removeDirChilds(path),
                        listFile(path, true);
                },
                queryState: function () {
                    return 0
                }
            },
            "list": {
                execute: function (path) {
                    listFile(path, false);
                },
                queryState: queryState
            }
        },
        "shortcutKeys": {
            "open": "13",//enter
            "refresh": "116" //f5
        },
        "events": {}
    };
});


UF.registerModule("addfilemodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "defaultOptions": {},
        "commands": {
            "touch": {
                execute: function (name) {
                    uf.fire('newFileTitle', '', function (name, callback) {
                        console.log('|******** touch done ********|');
                        var fullname = uf.getCurrentPath() + name;
                        if (name) {
                            uf.proxy.touch(fullname, function (d) {
                                callback && callback(d.state == 0);
                                if (d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.addFile(file);
                                    uf.fire('selectfiles', file.path);
                                } else {
                                    uf.fire('showmessage', {title: d.message, timeout: 3000});
                                }
                            });
                        }
                    });
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            },
            "mkdir": {
                execute: function (name) {
//                    if (name === undefined) {
//                        name = prompt('新建文件夹', '新建文件夹');
//                    } else if (name == '') {
//                        name = '新建文件夹';
//                    }

                    uf.fire('newFileTitle', 'dir', function (name, callback) {
                        console.log('|******** mkdir done ********|');
                        var fullname = uf.getCurrentPath() + name;
                        if (name) {
                            uf.proxy.mkdir(fullname, function (d) {
                                callback && callback(d.state == 0);
                                if (d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.addFile(file);
                                    uf.fire('selectfiles', file.path);
                                } else {
                                    uf.fire('showmessage', {title: d.message, timeout: 3000});
                                }
                            });
                        }
                    });
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "shortcutKeys": {
            "touch": "ctrl+78" //newfile ctrl+N
        },
        "events": {}
    };
});


UF.registerModule("removemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {},
        "commands": {
            "remove": {
                execute: function () {
                    if (!confirm(uf.getLang('warning')['removebefore'])) return;
                    var paths = uf.getSelection().getSelectedFiles();
                    if (paths.length) {
                        uf.dataTree.lockFiles(paths);
                        var req = uf.proxy.rm(paths, function (d) {
                            if (d.state == 0) {
                                uf.dataTree.removeFiles(paths);
                                uf.fire('removefiles', paths);
                            } else {
                                uf.fire('updatemessage', {title: d.message, timeout: 3000, id: req.id});
                            }
                            uf.dataTree.unLockFiles(paths);
                        });
                    }
                },
                queryState: function () {
                    var paths = uf.getSelection().getSelectedFiles();

                    if (paths.length > 0) {
                        for (var k in paths) {
                            var info = uf.dataTree.getFileInfo(paths[k]);
                            if (info && !(info.write && !uf.dataTree.isFileLocked(paths[k]))) {
                                return -1;
                            }
                        }
                        return 0;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "remove": "46" //remove Delete
        },
        "events": {}
    };
});


UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {},
        "commands": {
            "rename": {
                execute: function (name) {
                    var name,
                        fullname,
                        target = uf.getSelection().getSelectedFile();

                    if (target) {
                        // name = prompt('重命名', target.replace(/^.*\//, ''));
                        uf.fire('renameFileTitle', target, function (name, callback) {
                            console.log('|******** rename done ********|');
                            fullname = uf.getCurrentPath() + name;
                            if (name && target != fullname) {
                                uf.dataTree.lockFile(target);
                                var req = uf.proxy.rename(target, fullname, function (d) {
                                    callback && callback(d.state == 0);
                                    if (d.state == 0) {
                                        var file = (d && d.data && d.data.file);
                                        uf.dataTree.updateFile(target, file);
                                        uf.fire('selectfiles', file.path);
                                    } else {
                                        uf.fire('updatemessage', {title: d.message, timeout: 3000, id: req.id});
                                    }
                                    uf.dataTree.unLockFile(target);
                                });
                            }
                        });
                    }
                },
                queryState: function () {
                    var paths, info;
                    paths = uf.getSelection().getSelectedFiles();

                    if (paths.length == 1) {
                        info = uf.dataTree.getFileInfo(paths[0]);
                        return info && info.write && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "rename": browser.mac ? "13" : "113" //renamemac:Enter notmac: F2
        },
        "events": {}
    };
});


UF.registerModule("selectmodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "defaultOptions": {},
        "commands": {
            "selectall": {
                execute: function (name) {
                    var current = uf.getCurrentPath(),
                        filelist = uf.dataTree.listDirFileInfo(current),
                        paths = [];

                    $.each(filelist, function (k, v) {
                        paths.push(v.path);
                    });
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            },
            "selectfile": {
                execute: function (path) {
                    uf.fire('selectfiles', path);
                },
                queryState: function () {
                }
            },
            "selectnext": {
                execute: function (paths) {
                },
                queryState: function () {
                }
            },
            "selectprevious": {
                execute: function (paths) {
                },
                queryState: function () {
                }
            }
        },
        "shortcutKeys": {
            "selectall": "ctrl+65"//selectAll ctrl+A
//            "selectup": "37", //selectAll ctrl+up
//            "selectprevious": "38", //selectAll ctrl+left
//            "selectnext": "39", //selectAll ctrl+right
//            "selectdown": "40" //selectAll ctrl+down
        },
        "events": {
            'list.click': function () {

            }
        }
    };
});


UF.registerModule("uploadmodule", function () {
    var uf = this,
        initWebUploader = function () {

            var timestrap = (+new Date()).toString(36),
                messageId = 'u' + timestrap;

            // 创建webupoaler实例
            var uploader = uf.webuploader = WebUploader.create({
                dnd: '.ufui-list-container',
                // swf文件路径
                swf: uf.getOption('uploaderSwfUrl'),

                // 文件接收服务端。
                server: uf.getOption('serverUrl') + '?cmd=upload&target=' + uf.getCurrentPath(),

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                // pick: '#' + id,

                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,

                threads: 1,
                fileVal: uf.getOption('uploaderFileName'),
                formdata: {},
                duplicate: false

            });

            // 当有文件被添加进队列的时候
            uploader.on('fileQueued', function (file) {

                uf.execCommand('upload', file);
            });

            uf.fire('initUploader');

        };


    return {
        "init": function () {

        },
        "defaultOptions": {
            'uploaderFileName': 'file',
            'uploaderSwfUrl': uf.getOption('URL') + '/lib/webuploader/Uploader.swf',
            'uploaderJsUrl': uf.getOption('URL') + '/lib/webuploader/webuploader.js'
        },
        "commands": {
            "upload": {
                execute: function (file) {
                    if (file) {
                        aafile = file;
                        uf.proxy.upload(uf.getCurrentPath(), file, function (d) {
                            if (d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('selectfiles', file.path);
                            } else {
                                uf.fire('showmessage', {title: d.message, timeout: 3000});
                            }
                        });
                    }
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "events": {
            'ready': function () {
                var doc = uf.$container[0].ownerDocument;
                Utils.loadFile(doc, {
                    src: uf.getOption('uploaderJsUrl'),
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }, initWebUploader);
            },
            'currentpathchange': function (type, path) {
                uf.webuploader && uf.webuploader.option('server', uf.getOption('serverUrl') + '?cmd=upload&target=' + path);
            }
        }
    };
});


UF.registerModule("lookimagemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookimage": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookimage').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isImagePath(path) ? 0 : -1;
                }
            }
        }
    };
});


UF.registerModule("lookcodemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookcode": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookcode').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isCodePath(path) ? 0 : -1;
                }
            }
        }
    };
});


UF.registerModule("pathchangemodule", function () {
    var uf = this;
    return {
        "init": function () {
            uf._pathHistory = [];
            uf._pathHistoryIndex = 0;
        },
        "commands": {
            "pathparent": {
                execute: function () {
                    var path = uf.getCurrentPath(),
                        parentPath = Utils.getParentPath(path);
                    uf.setCurrentPath(parentPath);
                },
                queryState: function () {
                    return uf.getCurrentPath().length > 2 ? 0 : -1;
                }
            },
            "pathbackward": {
                execute: function () {
                    if (uf._pathHistoryIndex > 0) {
                        uf.setCurrentPath(uf._pathHistory[uf._pathHistoryIndex--]);
                    }
                },
                queryState: function () {
                    return uf._pathHistoryIndex > 1 ? 0 : -1;
                }
            },
            "pathforward": {
                execute: function () {

                },
                queryState: function () {
                    return uf._pathHistory.length > (uf._pathHistoryIndex + 1) ? 0 : -1;
                }
            }
        },
        "shortcutKeys": {
            "pathparent": "8" // 退格键
        },
        "events": {
            'currentPathChange': function (type, path) {
                uf._pathHistory.splice(uf._pathHistoryIndex, uf._pathHistory.length, path);
            }
        }
    };
});


UF.registerModule("downloadmodule", function () {
    var uf = this;
    return {
        "commands": {
            "download": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    var downloadUrl = uf.proxy.getRequestUrl({
                        'cmd': 'download',
                        'target': path
                    });
                    var $downloadIframe = $('<iframe src="' + downloadUrl + '">').hide().appendTo(document.body).load(function () {
                        setTimeout(function () {
                            $downloadIframe.remove();
                        }, 3000);
                    });
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile(),
                        info = uf.dataTree.getFileInfo(path);
                    return info && info.type != 'dir' ? 0 : -1;
                }
            }
        }
    };
});


UF.registerModule("initmodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "commands": {
            "init": {
                execute: function () {
                    uf.proxy.init(function (r) {
                        uf.dataTree.setRoot(r.data.root);
                    });
                }
            }
        },
        "events": {
            'ready': function () {
                uf.execCommand('init');
            },
            'dataReady': function () {
                uf.execCommand('open', '/');
            }
        }
    };
});


UF.registerModule("editmodule", function () {
    var uf = this;
    return {
        "defaultOptions": {},
        "commands": {
            "copy": {
                execute: function (path) {
                    uf.fire("copy", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "cut": {
                execute: function (path) {
                    uf.fire("cut", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "paste": {
                execute: function (path) {
                    uf.fire("paste", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "clear": {
                execute: function () {
                    uf.fire("clear");
                },
                queryState: function () {
                    return 0;
                }
            },
            "checkall": {
                execute: function () {
                    uf.fire("checkall");
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "copy": "ctrl+67",// ctrl + v
            "cut": "ctrl+88",// ctrl + x
            "paste": "ctrl+86",// ctrl + c
            //"checkall": "ctrl+65",// ctrl + a
            "clear": '27'// esc
        },
        "events": {}
    };
});


UF.registerModule("liststylemodule", function () {
    var uf = this;
    return {
        "commands": {
            "toggleliststyle": {
                execute: function (path) {
                    uf.$list.find(".ufui-list-container").toggleClass("list-style");
                },
                queryState: function () {
                    return 0;
                }
            },
            "togglepreview": {
                execute: function (path) {
                    uf.$container.toggleClass("middleview");
                    //uf.$list.find(".ufui-list-container").toggleClass("list-style");
                },
                queryState: function () {
                    return 0;
                }
            }
        }
    };
});

UF.registerModule("previewmodule", function () {
    var uf = this;
    var previewHandler = function (res) {
        var content = res.data['content'];
        uf.$preview.find(".display").html(content);
    };
    return {
        "commands": {
            "preview": {
                execute: function (path) {
                    uf.proxy.preview(path, previewHandler);
                },
                queryState: function () {
                    return 0;
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isCodePath(path) ? 0 : -1;
                }
            }
        }
    };
});

UF.registerModule("searchmodule", function () {
    var uf = this;
    var searchHandler = function (res) {
        // TODO: namespace stain?
        var results = res.data['results'];
        var sul = uf.$toolbar.find(".search-ul");
        var RECORD_MAX = 10;
        for (var i in results.slice(0, RECORD_MAX)) {
            var dir = results[i].substr(0, results[i].lastIndexOf('/') + 1);
            var file = results[i].substr(results[i].lastIndexOf('/') + 1);
            //sul.append($("<li data-path='" + dir + "' filename='" + file + "' >"
            //    +  + "</li>"));

            var tmpl = "<li data-path='<%=dir%>' filename='<%=file%>'><div class='title'><%=title%></div><div class='path'><%=dir%></div></li>";
            var options = {
                title: results[i].substr(results[i].lastIndexOf('/') + 1),
                dir: dir,
                file: file
            };
            sul.append($.parseTmpl(tmpl, options));
        }
        //uf.$preview.find(".display").html(content);
    };
    return {
        "commands": {
            "search": {
                execute: function (path) {
                    uf.proxy.search(path, searchHandler);
                },
                queryState: function () {
                    return 0;
                }
            },
            "searchindex": {
                execute: function (path) {
                    uf.fire("searchindex");
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "searchindex": "ctrl+70" // ctrl + f 检索
        }
    };
});


(function ($) {
    //对jquery的扩展
    $.parseTmpl = function parse(str, data) {
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function (match, code) {
                return "'," + code.replace(/\\'/g, "'") + ",'";
            }).replace(/<%([\s\S]+?)%>/g, function (match, code) {
                return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
            }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
        var func = new Function('obj', tmpl);
        return data ? func(data) : func;
    };
    $.extend2 = function (t, s) {
        var a = arguments,
            notCover = $.type(a[a.length - 1]) == 'boolean' ? a[a.length - 1] : false,
            len = $.type(a[a.length - 1]) == 'boolean' ? a.length - 1 : a.length;
        for (var i = 1; i < len; i++) {
            var x = a[i];
            for (var k in x) {
                if (!notCover || !t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    };

    $.IE6 = !!window.ActiveXObject && parseFloat(navigator.userAgent.match(/msie (\d+)/i)[1]) == 6;

    //所有ui的基类
    var _eventHandler = [];
    var _widget = function () {
    };
    var _prefix = 'ufui';
    _widget.prototype = {
        on: function (ev, cb) {
            this.root().on(ev, $.proxy(cb, this));
            return this;
        },
        off: function (ev, cb) {
            this.root().off(ev, $.proxy(cb, this));
            return this;
        },
        trigger: function (ev, data) {
            return this.root().trigger(ev, data) === false ? false : this;
        },
        root: function ($el) {
            return this._$el || (this._$el = $el);
        },
        destroy: function () {

        },
        data: function (key, val) {
            if (val !== undefined) {
                this.root().data(_prefix + key, val);
                return this;
            } else {
                return this.root().data(_prefix + key);
            }
        },
        register: function (eventName, $el, fn) {
            _eventHandler.push({
                'evtname': eventName,
                '$els': $.isArray($el) ? $el : [$el],
                handler: $.proxy(fn, $el)
            });
        }
    };

    //从jq实例上拿到绑定的widget实例
    $.fn.ufui = function (obj) {
        return obj ? this.data('ufuiwidget', obj) : this.data('ufuiwidget');
    };

    function _createClass(ClassObj, properties, supperClass) {
        ClassObj.prototype = $.extend2(
            $.extend({}, properties),
            (UF.ui[supperClass] || _widget).prototype,
            true
        );
        ClassObj.prototype.supper = (UF.ui[supperClass] || _widget).prototype;
        //父class的defaultOpt 合并
        if (UF.ui[supperClass] && UF.ui[supperClass].prototype.defaultOpt) {

            var parentDefaultOptions = UF.ui[supperClass].prototype.defaultOpt,
                subDefaultOptions = ClassObj.prototype.defaultOpt;

            ClassObj.prototype.defaultOpt = $.extend({}, parentDefaultOptions, subDefaultOptions || {});

        }
        return ClassObj;
    }

    var _guid = 1;

    function mergeToJQ(ClassObj, className) {
        $[_prefix + className] = ClassObj;
        $.fn[_prefix + className] = function (opt) {
            var result, args = Array.prototype.slice.call(arguments, 1);

            this.each(function (i, el) {
                var $this = $(el);
                var obj = $this.ufui();
                if (!obj) {
                    new ClassObj(!opt || !$.isPlainObject(opt) ? {} : opt, $this);
                    $this.ufui(obj);
                }
                if ($.type(opt) == 'string') {
                    if (opt == 'this') {
                        result = obj;
                    } else {
                        result = obj[opt].apply(obj, args);
                        if (result !== obj && result !== undefined) {
                            return false;
                        }
                        result = null;
                    }

                }
            });

            return result !== null ? result : this;
        };
    }

    UF.ui = {
        define: function (className, properties, supperClass) {
            var ClassObj = UF.ui[className] = _createClass(function (options, $el) {
                var _obj = function () {
                };
                $.extend(_obj.prototype, ClassObj.prototype, {
                        guid: className + _guid++,
                        widgetName: className
                    }
                );
                var obj = new _obj();
                if ($.type(options) == 'string') {
                    obj.init && obj.init({});
                    obj.root().ufui(obj);
                    obj.root().find('a').click(function (evt) {
                        evt.preventDefault();
                    });
                    return obj.root()[_prefix + className].apply(obj.root(), arguments);
                } else {
                    $el && obj.root($el);
                    obj.init && obj.init(!options || $.isPlainObject(options) ? $.extend2(options || {}, obj.defaultOpt || {}, true) : options);
                    try {
                        obj.root().find('a').click(function (evt) {
                            evt.preventDefault();
                        });
                    } catch (e) {
                    }

                    return obj.root().ufui(obj);
                }

            }, properties, supperClass);

            mergeToJQ(ClassObj, className);
        }
    };

    $(function () {
        $(document).on('click mouseup mousedown dblclick mouseover', function (evt) {
            $.each(_eventHandler, function (i, obj) {
                if (obj.evtname == evt.type) {
                    $.each(obj.$els, function (i, $el) {
                        if ($el[0] !== evt.target && !$.contains($el[0], evt.target)) {
                            obj.handler(evt);
                        }
                    });
                }
            });
        });
    });
})(jQuery);


//button 类
UF.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="ufui-btn ufui-btn-<%=icon%> <%if(name){%>ufui-btn-name-<%=name%><%}%>" unselectable="on" onmousedown="return false" <%}else{%>a class="ufui-text-btn"<%}%><% if(title) {%>title="<%=title%>" data-original-title="<%=title%>" <%};%>> ' +
    '<% if(icon) {%><div unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><% }; %><%if(text) {%><span unselectable="on" onmousedown="return false" class="ufui-button-label"><%=text%></span><%}%>' +
    '<%if(caret && text){%><span class="ufui-button-spacing"></span><%}%>' +
    '<% if(caret) {%><span unselectable="on" onmousedown="return false" class="ufui-caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt);
            });

        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover');
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            return $.proxy(fn, this, evt)();
        }
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.ufui-button-label').text();
        } else {
            this.root().find('.ufui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {

        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click', function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            });
        }).register('click', me.root(), function (evt) {
            $obj.hide();
        });
    }
});


/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function () {

    var widgetName = 'combobox',
        itemClassName = 'ufui-combobox-item',
        HOVER_CLASS = 'ufui-combobox-item-hover',
        ICON_CLASS = 'ufui-combobox-checked-icon',
        labelClassName = 'ufui-combobox-item-label';

    UF.ui.define(widgetName, (function () {

        return {
            tpl: "<ul class=\"dropdown-menu ufui-combobox-menu<%if (comboboxName!=='') {%> ufui-combobox-<%=comboboxName%><%}%>\" unselectable=\"on\" onmousedown=\"return false\" role=\"menu\" aria-labelledby=\"dropdownMenu\">" +
            "<%if(autoRecord) {%>" +
            "<%for( var i=0, len = recordStack.length; i<len; i++ ) {%>" +
            "<%var index = recordStack[i];%>" +
            "<li class=\"<%=itemClassName%><%if( selected == index ) {%> ufui-combobox-checked<%}%>\" data-item-index=\"<%=index%>\" unselectable=\"on\" onmousedown=\"return false\">" +
            "<span class=\"ufui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
            "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ index ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=items[index]%></label>" +
            "</li>" +
            "<%}%>" +
            "<%if( i ) {%>" +
            "<li class=\"ufui-combobox-item-separator\"></li>" +
            "<%}%>" +
            "<%}%>" +
            "<%for( var i=0, label; label = items[i]; i++ ) {%>" +
            "<li class=\"<%=itemClassName%><%if( selected == i ) {%> ufui-combobox-checked<%}%> ufui-combobox-item-<%=i%>\" data-item-index=\"<%=i%>\" unselectable=\"on\" onmousedown=\"return false\">" +
            "<span class=\"ufui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
            "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ i ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=label%></label>" +
            "</li>" +
            "<%}%>" +
            "</ul>",
            defaultOpt: {
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
                //item对应的值列表
                value: [],
                comboboxName: '',
                selected: '',
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function (options) {

                var me = this;

                $.extend(me._optionAdaptation(options), me._createItemMapping(options.recordStack, options.items), {
                    itemClassName: itemClassName,
                    iconClass: ICON_CLASS,
                    labelClassName: labelClassName
                });

                this._transStack(options);

                me.root($($.parseTmpl(me.tpl, options)));

                this.data('options', options).initEvent();

            },
            initEvent: function () {

                var me = this;

                me.initSelectItem();

                this.initItemActive();

            },
            /**
             * 初始化选择项
             */
            initSelectItem: function () {

                var me = this,
                    labelClass = "." + labelClassName;

                me.root().delegate('.' + itemClassName, 'click', function () {

                    var $li = $(this),
                        index = $li.attr('data-item-index');

                    me.trigger('comboboxselect', {
                        index: index,
                        label: $li.find(labelClass).text(),
                        value: me.data('options').value[index]
                    }).select(index);

                    me.hide();

                    return false;

                });

            },
            initItemActive: function () {
                var fn = {
                    mouseenter: 'addClass',
                    mouseleave: 'removeClass'
                };
                if ($.IE6) {
                    this.root().delegate('.' + itemClassName, 'mouseenter mouseleave', function (evt) {
                        $(this)[fn[evt.type]](HOVER_CLASS);
                    }).one('afterhide', function () {
                    });
                }
            },
            /**
             * 选择给定索引的项
             * @param index 项索引
             * @returns {*} 如果存在对应索引的项，则返回该项；否则返回null
             */
            select: function (index) {

                var itemCount = this.data('options').itemCount,
                    items = this.data('options').autowidthitem;

                if (items && !items.length) {
                    items = this.data('options').items;
                }

                if (itemCount == 0) {
                    return null;
                }

                if (index < 0) {

                    index = itemCount + index % itemCount;

                } else if (index >= itemCount) {

                    index = itemCount - 1;

                }

                this.trigger('changebefore', items[index]);

                this._update(index);

                this.trigger('changeafter', items[index]);

                return null;

            },
            selectItemByLabel: function (label) {

                var itemMapping = this.data('options').itemMapping,
                    me = this,
                    index = null;

                !$.isArray(label) && ( label = [label] );

                $.each(label, function (i, item) {

                    index = itemMapping[item];

                    if (index !== undefined) {

                        me.select(index);
                        return false;

                    }

                });

            },
            /**
             * 转换记录栈
             */
            _transStack: function (options) {

                var temp = [],
                    itemIndex = -1,
                    selected = -1;

                $.each(options.recordStack, function (index, item) {

                    itemIndex = options.itemMapping[item];

                    if ($.isNumeric(itemIndex)) {

                        temp.push(itemIndex);

                        //selected的合法性检测
                        if (item == options.selected) {
                            selected = itemIndex;
                        }

                    }

                });

                options.recordStack = temp;
                options.selected = selected;
                temp = null;

            },
            _optionAdaptation: function (options) {

                if (!( 'itemStyles' in options )) {

                    options.itemStyles = [];

                    for (var i = 0, len = options.items.length; i < len; i++) {
                        options.itemStyles.push('');
                    }

                }

                options.autowidthitem = options.autowidthitem || options.items;
                options.itemCount = options.items.length;

                return options;

            },
            _createItemMapping: function (stackItem, items) {

                var temp = {},
                    result = {
                        recordStack: [],
                        mapping: {}
                    };

                $.each(items, function (index, item) {
                    temp[item] = index;
                });

                result.itemMapping = temp;

                $.each(stackItem, function (index, item) {

                    if (temp[item] !== undefined) {
                        result.recordStack.push(temp[item]);
                        result.mapping[item] = temp[item];
                    }

                });

                return result;

            },
            _update: function (index) {

                var options = this.data("options"),
                    newStack = [],
                    newChilds = null;

                $.each(options.recordStack, function (i, item) {

                    if (item != index) {
                        newStack.push(item);
                    }

                });

                //压入最新的记录
                newStack.unshift(index);

                if (newStack.length > options.recordCount) {
                    newStack.length = options.recordCount;
                }

                options.recordStack = newStack;
                options.selected = index;

                newChilds = $($.parseTmpl(this.tpl, options));

                //重新渲染
                this.root().html(newChilds.html());

                newChilds = null;
                newStack = null;

            }
        };

    })(), 'menu');

})();

/*modal 类*/
UF.ui.define('modal', {
    tpl: '<div class="ufui-modal" tabindex="-1" >' +
    '<div class="ufui-modal-header">' +
    '<div class="ufui-close" data-hide="modal"></div>' +
    '<h3 class="ufui-title"><%=title%></h3>' +
    '</div>' +
    '<div class="ufui-modal-body"  style="<%if(width){%>width:<%=width%>px;<%}%>' +
    '<%if(height){%>height:<%=height%>px;<%}%>">' +
    ' </div>' +
    '<% if(cancellabel || oklabel) {%>' +
    '<div class="ufui-modal-footer">' +
    '<div class="ufui-modal-tip"></div>' +
    '<%if(oklabel){%><div class="ufui-btn ufui-btn-primary" data-ok="modal"><%=oklabel%></div><%}%>' +
    '<%if(cancellabel){%><div class="ufui-btn" data-hide="modal"><%=cancellabel%></div><%}%>' +
    '</div>' +
    '<%}%></div>',
    defaultOpt: {
        title: "",
        cancellabel: "",
        oklabel: "",
        width: '',
        height: '',
        backdrop: true,
        keyboard: true
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options || {})));

        me.data("options", options);
        if (options.okFn) {
            me.on('ok', $.proxy(options.okFn, me));
        }
        if (options.cancelFn) {
            me.on('beforehide', $.proxy(options.cancelFn, me));
        }

        me.root().delegate('[data-hide="modal"]', 'click', $.proxy(me.hide, me))
            .delegate('[data-ok="modal"]', 'click', $.proxy(me.ok, me));

        $('[data-hide="modal"],[data-ok="modal"]', me.root()).hover(function () {
            $(this).toggleClass('ufui-hover');
        });
    },
    toggle: function () {
        var me = this;
        return me[!me.data("isShown") ? 'show' : 'hide']();
    },
    show: function () {

        var me = this;

        me.trigger("beforeshow");

        if (me.data("isShown")) return;

        me.data("isShown", true);

        me.escape();

        me.backdrop(function () {
            me.autoCenter();
            me.root()
                .show()
                .focus()
                .trigger('aftershow');
        });
    },
    showTip: function (text) {
        $('.ufui-modal-tip', this.root()).html(text).fadeIn();
    },
    hideTip: function (text) {
        $('.ufui-modal-tip', this.root()).fadeOut(function () {
            $(this).html('');
        });
    },
    autoCenter: function () {
        //ie6下不用处理了
        if (!$.IE6) {
            /* 调整宽度 */
            this.root().css("margin-left", -(this.root().width() / 2));
            /* 调整高度 */
            this.root().css("margin-top", -(this.root().height() / 2));
        }
    },
    hide: function () {
        var me = this;

        me.trigger("beforehide");

        if (!me.data("isShown")) return;

        me.data("isShown", false);

        me.escape();

        me.hideModal();
    },
    escape: function () {
        var me = this;
        if (me.data("isShown") && me.data("options").keyboard) {
            me.root().on('keyup', function (e) {
                e.which == 27 && me.hide();
            });
        }
        else if (!me.data("isShown")) {
            me.root().off('keyup');
        }
    },
    hideModal: function () {
        var me = this;
        me.root().hide();
        me.backdrop(function () {
            me.removeBackdrop();
            me.trigger('afterhide');
        });
    },
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    },
    backdrop: function (callback) {
        var me = this;
        if (me.data("isShown") && me.data("options").backdrop) {
            me.$backdrop = $('<div class="ufui-modal-backdrop" />').click(
                me.data("options").backdrop == 'static' ?
                    $.proxy(me.root()[0].focus, me.root()[0])
                    : $.proxy(me.hide, me)
            );
        }
        me.trigger('afterbackdrop');
        callback && callback();

    },
    attachTo: function ($obj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {

            $obj.data('$mergeObj', me.root());
            $obj.on('click', function () {
                me.toggle($obj);
            });
            me.data('$mergeObj', $obj);
        }
    },
    ok: function () {
        var me = this;
        me.trigger('beforeok');
        if (me.trigger("ok", me) === false) {
            return;
        }
        me.hide();
    },
    getBodyContainer: function () {
        return this.root().find('.ufui-modal-body');
    }
});


//scale 类
UF.ui.define('scale', {
    tpl: '<div class="ufui-scale" unselectable="on">' +
    '<span class="ufui-scale-hand0"></span>' +
    '<span class="ufui-scale-hand1"></span>' +
    '<span class="ufui-scale-hand2"></span>' +
    '<span class="ufui-scale-hand3"></span>' +
    '<span class="ufui-scale-hand4"></span>' +
    '<span class="ufui-scale-hand5"></span>' +
    '<span class="ufui-scale-hand6"></span>' +
    '<span class="ufui-scale-hand7"></span>' +
    '</div>',
    defaultOpt: {
        $doc: $(document),
        $wrap: $(document)
    },
    init: function (options) {
        if (options.$doc) this.defaultOpt.$doc = options.$doc;
        if (options.$wrap) this.defaultOpt.$wrap = options.$wrap;
        this.root($($.parseTmpl(this.tpl, options)));
        this.initStyle();
        this.startPos = this.prePos = {x: 0, y: 0};
        this.dragId = -1;
        return this;
    },
    initStyle: function () {
        utils.cssRule('ufui-style-scale', '.ufui-scale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;}' +
        '.ufui-scale span{position:absolute;left:0;top:0;width:7px;height:7px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}' +
        '.ufui-scale .ufui-scale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}' +
        '.ufui-scale .ufui-scale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}' +
        '.ufui-scale .ufui-scale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}' +
        '.ufui-scale .ufui-scale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}' +
        '.ufui-scale .ufui-scale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}' +
        '.ufui-scale .ufui-scale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}' +
        '.ufui-scale .ufui-scale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}' +
        '.ufui-scale .ufui-scale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}');
    },
    _eventHandler: function (e) {
        var me = this,
            $doc = me.defaultOpt.$doc;
        switch (e.type) {
            case 'mousedown':
                var hand = e.target || e.srcElement;
                if (hand.className.indexOf('ufui-scale-hand') != -1) {
                    me.dragId = hand.className.slice(-1);
                    me.startPos.x = me.prePos.x = e.clientX;
                    me.startPos.y = me.prePos.y = e.clientY;
                    $doc.bind('mousemove', $.proxy(me._eventHandler, me));
                }
                break;
            case 'mousemove':
                if (me.dragId != -1) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                    me.prePos.x = e.clientX;
                    me.prePos.y = e.clientY;
                    me.updateTargetElement();
                }
                break;
            case 'mouseup':
                if (me.dragId != -1) {
                    me.dragId = -1;
                    me.updateTargetElement();
                    var $target = me.data('$scaleTarget');
                    if ($target.parent()) me.attachTo(me.data('$scaleTarget'));
                }
                $doc.unbind('mousemove', $.proxy(me._eventHandler, me));
                break;
            default:
                break;
        }
    },
    updateTargetElement: function () {
        var me = this,
            $root = me.root(),
            $target = me.data('$scaleTarget');
        $target.css({width: $root.width(), height: $root.height()});
        me.attachTo($target);
    },
    updateContainerStyle: function (dir, offset) {
        var me = this,
            $dom = me.root(),
            tmp,
            rect = [
                //[left, top, width, height]
                [0, 0, -1, -1],
                [0, 0, 0, -1],
                [0, 0, 1, -1],
                [0, 0, -1, 0],
                [0, 0, 1, 0],
                [0, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        if (rect[dir][0] != 0) {
            tmp = parseInt($dom.offset().left) + offset.x;
            $dom.css('left', me._validScaledProp('left', tmp));
        }
        if (rect[dir][1] != 0) {
            tmp = parseInt($dom.offset().top) + offset.y;
            $dom.css('top', me._validScaledProp('top', tmp));
        }
        if (rect[dir][2] != 0) {
            tmp = $dom.width() + rect[dir][2] * offset.x;
            $dom.css('width', me._validScaledProp('width', tmp));
        }
        if (rect[dir][3] != 0) {
            tmp = $dom.height() + rect[dir][3] * offset.y;
            $dom.css('height', me._validScaledProp('height', tmp));
        }
    },
    _validScaledProp: function (prop, value) {
        var $ele = this.root(),
            $wrap = this.defaultOpt.$doc,
            calc = function (val, a, b) {
                return (val + a) > b ? b - a : value;
            };

        value = isNaN(value) ? 0 : value;
        switch (prop) {
            case 'left':
                return value < 0 ? 0 : calc(value, $ele.width(), $wrap.width());
            case 'top':
                return value < 0 ? 0 : calc(value, $ele.height(), $wrap.height());
            case 'width':
                return value <= 0 ? 1 : calc(value, $ele.offset().left, $wrap.width());
            case 'height':
                return value <= 0 ? 1 : calc(value, $ele.offset().top, $wrap.height());
        }
    },
    show: function ($obj) {
        var me = this;
        if ($obj) me.attachTo($obj);
        me.root().bind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.bind('mouseup', $.proxy(me._eventHandler, me));
        me.root().show();
        me.trigger("aftershow");
    },
    hide: function () {
        var me = this;
        me.root().unbind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.unbind('mouseup', $.proxy(me._eventHandler, me));
        me.root().hide();
        me.trigger('afterhide');
    },
    attachTo: function ($obj) {
        var me = this,
            imgPos = $obj.offset(),
            $root = me.root(),
            $wrap = me.defaultOpt.$wrap,
            posObj = $wrap.offset();

        me.data('$scaleTarget', $obj);
        me.root().css({
            position: 'absolute',
            width: $obj.width(),
            height: $obj.height(),
            left: imgPos.left - posObj.left - parseInt($wrap.css('border-left-width')) - parseInt($root.css('border-left-width')),
            top: imgPos.top - posObj.top - parseInt($wrap.css('border-top-width')) - parseInt($root.css('border-top-width'))
        });
    },
    getScaleTarget: function () {
        return this.data('$scaleTarget')[0];
    }
});


//splitbutton 类
///import button
UF.ui.define('splitbutton', {
    tpl: '<div class="ufui-splitbutton <%if (name){%>ufui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="ufui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><%}%><%if(text){%><%=text%><%}%></div>' +
    '<div  unselectable="on" class="ufui-btn ufui-dropdown-toggle" >' +
    '<div  unselectable="on" class="ufui-caret"><\/div>' +
    '</div>' +
    '</div>',
    defaultOpt: {
        text: '',
        title: '',
        click: function () {
        }
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().find('.ufui-btn:first').click(function (evt) {
            if (!me.disabled()) {
                $.proxy(options.click, me)();
            }
        });
        me.root().find('.ufui-dropdown-toggle').click(function () {
            if (!me.disabled()) {
                me.trigger('arrowclick');
            }
        });
        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover');
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            $.proxy(fn, this, evt)();
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state).find('.ufui-btn').toggleClass('ufui-disabled', state);
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state).find('.ufui-btn:first').toggleClass('ufui-active', state);
        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.root().delegate('.ufui-dropdown-toggle', 'click', function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            });
        });
        me.register('click', me.root().find('.ufui-dropdown-toggle'), function (evt) {
            $obj.hide();
        });
    }
});


/*tooltip 类*/
UF.ui.define('tooltip', {
    tpl: '<div class="ufui-tooltip" unselectable="on" onmousedown="return false"><div class="ufui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="ufui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options || {})));
    },
    content: function (e) {
        var me = this,
            title = $(e.currentTarget).attr("data-original-title");

        me.root().find('.ufui-tooltip-inner').text(title);
    },
    position: function (e) {
        var me = this,
            $obj = $(e.currentTarget);

        me.root().css($.extend({display: 'block'}, $obj ? {
            top: $obj.outerHeight(),
            left: (($obj.outerWidth() - me.root().outerWidth()) / 2)
        } : {}));
    },
    show: function (e) {
        if ($(e.currentTarget).hasClass('ufui-disabled')) return;

        var me = this;
        me.content(e);
        me.root().appendTo($(e.currentTarget));
        me.position(e);
        me.root().css('display', 'block');
    },
    hide: function () {
        var me = this;
        me.root().css('display', 'none');
    },
    attachTo: function ($obj) {
        var me = this;

        function tmp($obj) {
            var me = this;

            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo($obj);
            }

            me.data('tooltip', me.root());

            $obj.each(function () {
                if ($(this).attr("data-original-title")) {
                    $(this).on('mouseenter', $.proxy(me.show, me))
                        .on('mouseleave click', $.proxy(me.hide, me));

                }
            });

        }

        if ($.type($obj) === "undefined") {
            $("[data-original-title]").each(function (i, el) {
                tmp.call(me, $(el));
            });

        } else {
            if (!$obj.data('tooltip')) {
                tmp.call(me, $obj);
            }
        }
    }
});


/**
 * Combox 抽象基类
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function () {

    var widgetName = 'buttoncombobox';

    UF.ui.define(widgetName, (function () {

        return {
            defaultOpt: {
                //按钮初始文字
                label: '',
                title: ''
            },
            init: function (options) {

                var me = this;

                var btnWidget = $.ufuibutton({
                    caret: true,
                    name: options.comboboxName,
                    title: options.title,
                    text: options.label,
                    click: function () {
                        me.show(this.root());
                    }
                });

                me.supper.init.call(me, options);

                //监听change， 改变button显示内容
                me.on('changebefore', function (e, label) {
                    btnWidget.ufuibutton('label', label);
                });

                me.data('button', btnWidget);

                me.attachTo(btnWidget);

            },
            button: function () {
                return this.data('button');
            }
        };

    })(), 'combobox');

})();


//dropmenu 类
UF.ui.define('dropmenu', {
    tmpl: '<ul class="ufui-dropdown-menu" aria-labelledby="dropdownMenu" >' +
    '<%for(var i=0,ci;ci=data[i++];){%>' +
    '<%if(ci.divider){%><li class="ufui-divider"></li><%}else{%>' +
    '<li <%if(ci.active||ci.disabled){%>class="<%= ci.active|| \'\' %> <%=ci.disabled||\'\' %>" <%}%> data-value="<%= ci.value%>">' +
    '<a href="#" tabindex="-1"><em class="ufui-dropmenu-checkbox"><i class="ufui-icon-ok"></i></em><%= ci.label%></a>' +
    '</li><%}%>' +
    '<%}%>' +
    '</ul>',
    defaultOpt: {
        data: [],
        click: function () {

        }
    },
    init: function (options) {
        var me = this;
        var eventName = {
            click: 1,
            mouseover: 1,
            mouseout: 1
        };

        this.root($($.parseTmpl(this.tmpl, options))).on('click', 'li[class!="ufui-disabled ufui-divider ufui-dropdown-submenu"]', function (evt) {
            $.proxy(options.click, me, evt, $(this).data('value'), $(this))();
        }).find('li').each(function (i, el) {
            var $this = $(this);
            if (!$this.hasClass("ufui-disabled ufui-divider ufui-dropdown-submenu")) {
                var data = options.data[i];
                $.each(eventName, function (k) {
                    data[k] && $this[k](function (evt) {
                        $.proxy(data[k], el)(evt, data, me.root);
                    });
                });
            }
        });

    },
    disabled: function (cb) {
        $('li[class!=ufui-divider]', this.root()).each(function () {
            var $el = $(this);
            if (cb === true) {
                $el.addClass('ufui-disabled');
            } else if ($.isFunction(cb)) {
                $el.toggleClass('ufui-disabled', cb(li));
            } else {
                $el.removeClass('ufui-disabled');
            }

        });
    },
    val: function (val) {
        var currentVal;
        $('li[class!="ufui-divider ufui-disabled ufui-dropdown-submenu"]', this.root()).each(function () {
            var $el = $(this);
            if (val === undefined) {
                if ($el.find('em.ufui-dropmenu-checked').length) {
                    currentVal = $el.data('value');
                    return false;
                }
            } else {
                $el.find('em').toggleClass('ufui-dropmenu-checked', $el.data('value') == val);
            }
        });
        if (val === undefined) {
            return currentVal;
        }
    },
    addSubmenu: function (label, menu, index) {
        index = index || 0;

        var $list = $('li[class!=ufui-divider]', this.root());
        var $node = $('<li class="ufui-dropdown-submenu"><a tabindex="-1" href="#">' + label + '</a></li>').append(menu);

        if (index >= 0 && index < $list.length) {
            $node.insertBefore($list[index]);
        } else if (index < 0) {
            $node.insertBefore($list[0]);
        } else if (index >= $list.length) {
            $node.appendTo($list);
        }
    }
}, 'menu');


//menu 类
UF.ui.define('menu', {
    show: function ($obj, dir, fnname, topOffset, leftOffset) {

        fnname = fnname || 'position';
        if (this.trigger('beforeshow') === false) {
            return;
        } else {
            this.root().css($.extend({display: 'block'}, $obj ? {
                top: $obj[fnname]().top + ( dir == 'right' ? 0 : $obj.outerHeight()) - (topOffset || 0),
                left: $obj[fnname]().left + (dir == 'right' ? $obj.outerWidth() : 0) - (leftOffset || 0)
            } : {}));
            this.trigger('aftershow');
        }
    },
    hide: function (all) {
        var $parentmenu;
        if (this.trigger('beforehide') === false) {
            return;
        } else {

            if ($parentmenu = this.root().data('parentmenu')) {
                if ($parentmenu.data('parentmenu') || all)
                    $parentmenu.ufui().hide();
            }
            this.root().css('display', 'none');
            this.trigger('afterhide');
        }
    },
    attachTo: function ($obj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {
            $obj.data('$mergeObj', me.root());
            $obj.on('wrapclick', function (evt) {
                me.show();
            });
            me.register('click', $obj, function (evt) {
                me.hide();
            });
            me.data('$mergeObj', $obj);
        }
    }
});


//popup 类
UF.ui.define('popup', {
    tpl: '<div class="ufui-dropdown-menu ufui-popup"' +
    '<%if(!<%=stopprop%>){%>onmousedown="return false"<%}%>' +
    '><div class="ufui-popup-body" unselectable="on" onmousedown="return false"><%=subtpl%></div>' +
    '<div class="ufui-popup-caret"></div>' +
    '</div>',
    defaultOpt: {
        stopprop: false,
        subtpl: '',
        width: '',
        height: ''
    },
    init: function (options) {
        this.root($($.parseTmpl(this.tpl, options)));
        return this;
    },
    mergeTpl: function (data) {
        return $.parseTmpl(this.tpl, {subtpl: data});
    },
    show: function ($obj, posObj) {
        if (!posObj) posObj = {};

        var fnname = posObj.fnname || 'position';
        if (this.trigger('beforeshow') === false) {
            return;
        } else {
            this.root().css($.extend({display: 'block'}, $obj ? {
                top: $obj[fnname]().top + ( posObj.dir == 'right' ? 0 : $obj.outerHeight()) - (posObj.offsetTop || 0),
                left: $obj[fnname]().left + (posObj.dir == 'right' ? $obj.outerWidth() : 0) - (posObj.offsetLeft || 0),
                position: 'absolute'
            } : {}));

            this.root().find('.ufui-popup-caret').css({
                top: posObj.caretTop || 0,
                left: posObj.caretLeft || 0,
                position: 'absolute'
            }).addClass(posObj.caretDir || "up");

        }
        this.trigger("aftershow");
    },
    hide: function () {
        this.root().css('display', 'none');
        this.trigger('afterhide');
    },
    attachTo: function ($obj, posObj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {
            $obj.data('$mergeObj', me.root());
            $obj.on('wrapclick', function (evt) {
                me.show($obj, posObj);
            });
            me.register('click', $obj, function (evt) {
                me.hide();
            });
            me.data('$mergeObj', $obj);
        }
    },
    getBodyContainer: function () {
        return this.root().find(".ufui-popup-body");
    }
});


//button 类
UF.ui.define('separator', {
    tpl: '<div class="ufui-separator" unselectable="on" onmousedown="return false" ></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});

//toolbar 类
(function () {
    UF.ui.define('toolbar', {
        tpl: '<div class="ufui-toolbar"  ><div class="ufui-btn-toolbar"></div></div>',
        init: function (options) {
            var me = this;
            var item = $(me.tpl);
            var $root = this.root(item);
            this.data('$btnToolbar', $root.find('.ufui-btn-toolbar'));
        },
        appendToBtnmenu: function (data) {
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data, function (i, $item) {
                $cont.append($item);
            });
        }
    });
})();


UF.ui.define('file', {
    tpl: '<a draggable="true" filetype="<%=type%>" title="<%=title%>" dataurl="file/<%=type%>:<%=title%>:<%=link%>" class="ufui-file ufui-file-<%=pers%>" data-path="<%=path%>">' +
    '<div class="ufui-file-icon" >' +
    '   <i class="ufui-file-icon-<%=type%>"></i>' +
    '   <span class="ufui-file-pers"></span>' +
    '</div>' +
    '<div class="ufui-file-title"><%=title%></div>' +
    '<div class="ufui-file-details"><%=details%></div>' +
    '</a>',
    defaultOpt: {
        type: '',
        title: '',
        path: '',
        details: '',
        pers: 'wr',
        link: ''
    },
    init: function (options) {
        var me = this;
        var item = $($.parseTmpl(me.tpl, options));
        me.root(item);
        me.root().find('.ufui-file-title').on('focus blur', function (evt) {
//            console.log(+new Date(), evt.type, evt)
        });

        return me;
    },
    editabled: function (state, callback) {
        var me = this,
            $title = this.root().find('.ufui-file-title');
        if (state === undefined) {
            return $title.attr('contenteditable');
        } else if (!state) {
            $title.removeClass('ufui-file-title-editable').attr('contenteditable', 'false');
            console.log("leave edit");

            me.renameFlag = false;
        } else {
            if (me.renameFlag) return this;

            var isExit = false,
                finishHandler = function (evt) {
                    callback($title.text());
                    $title.focus().off('blur keydown', renameHandler);
                    me.editabled(false);
                    me.renameFlag = false;
                    evt.preventDefault();
                    return false;
                },
                renameHandler = function (evt) {
                    console.log('---', evt.type, evt.keyCode);
                    if (evt.type == 'blur' && !isExit) {
                        return finishHandler(evt);
                    } else if (evt.type == 'keydown') {
                        if (evt.keyCode == 46) { // delete 冲突(Remove cmd)
                            //evt.preventDefault();
                            //return true;
                        } else if (evt.keyCode == 27) { //Esc取消
                            isExit = true;
                            //return finishHandler(evt);
                        } else if (evt.keyCode == 13) { //Enter提交
                            return finishHandler(evt);
                        }
                    } else if (evt.type == 'click') {
                        //console.log($(evt.target).attr("contenteditable") );
                        //eee = evt;
                        // 进入编辑状态 & 编辑状态移动 冲突
                        if ($(evt.target).attr("contenteditable") == 'false') return true;
                        evt.preventDefault();
                        return false;
                    }
                };
            $title.addClass('ufui-file-title-editable').attr('contenteditable', 'true');
            console.log("enter edit");

            me.renameFlag = true;
            setTimeout(function () {
                $title.focus();
                setTimeout(function () {
                    //$title.on('keydown click blur', renameHandler);
                    $title.on('keydown click blur', renameHandler);
                }, 100);
            }, 100);
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    setTitle: function (title) {
        this.root().find('.ufui-file-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.root().find('.ufui-file-title').text();
    },
    setType: function (type) {
        this.root().find('.ufui-file-icon i').attr('class', 'ufui-file-icon-' + type).attr('style', '');
        return this;
    },
    getType: function () {
        var c = this.root().find('.ufui-file-icon i'),
            m = c.attr('class').match(/ufui-file-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setPath: function (path) {
        this.root().attr('data-path', path);
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setPers: function (write, read) {
        this.root().addClass('ufui-file-' + (write ? 'w' : 'nw') + ('read' ? 'r' : 'nr'));
        return this;
    },
    getPers: function () {
        var $root = this.root(),
            write = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-nw-r'),
            read = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-w-nr');
        return {'write': write, 'read': read};
    },
    setPreviewImg: function (src) {
        var me = this;
        $('<img src="' + src + '" style="display:none;">').appendTo(document.body).on('load', function () {
            var $target = $(this);
            me.root().find('.ufui-file-icon i').css({
                'background-image': 'url("' + src + '")',
                'background-size': $target.width() > $target.height() ? 'auto 100%' : '100% auto',
                'background-position': 'center center',
                'background-repeat': 'no-repeat no-repeat',
                'border-radius': '3px',
                'width': '60px',
                'height': '60px',
                'margin': '10px auto 0 auto'
            });
            $target.remove();
        });
    }
});


UF.ui.define('list', {
    tpl: '<div class="ufui-list">' +
    '<div class="ufui-list-container"></div><div class="ufui-select-box" style="display:none;"></div>' +
    '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options))).append(me.$list);
        me.$list = me.root().find('.ufui-list-container');
        me._ufItems = [];

        return me;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else if (type1 != type2) {
            return type1 > type2;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        for (var i = 0; i < this._ufItems.length; i++) {
            if (this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for (i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (this._compare(c, ufFile)) break;
        }

        if (i >= this._ufItems.length) {
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function (path, fadeOutTime) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                if (fadeOutTime) {
                    c.active(false).root().fadeOut(fadeOutTime || 0, function () {
                        $(this).remove();
                    });
                } else {
                    c.root().remove();
                }
                break;
            }
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInList: function (path) {
        return this.getItem(path) ? true : false;
    }
});


UF.ui.define('leaf', {
    tpl: '<li class="ufui-leaf" data-path="<%=path%>">' +
    '   <div class="ufui-leaf-detail ufui-leaf-detail-closed">' +
    '       <div class="ufui-leaf-expand"></div>' +
    '       <div class="ufui-leaf-folder"><i class="ufui-leaf-folder-<%=type%>"></i></div>' +
    '       <div class="ufui-leaf-title"><%=title%></div>' +
    '   </div>' +
    '   <ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
    '</li>',
    defaultOpt: {
        type: 'dir',
        title: '',
        path: '/',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        options.path = Utils.regularDirPath(options.path);
        me.root($($.parseTmpl(me.tpl, options)));
        var $detail = me.$detail = me.root().children().eq(0);
        me.$branch = me.root().children().eq(1);

        /* 设置展开收起文件夹 */
        $detail.find('.ufui-leaf-expand').on('click', function () {
            if ($detail.hasClass('ufui-leaf-detail-opened')) {
                me.expand(false);
            } else {
                me.expand(true);
            }
        });

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    expand: function (state) {
        if (state) {
            this.$detail.removeClass('ufui-leaf-detail-closed').addClass('ufui-leaf-detail-opened');
            this.$branch.removeClass('ufui-tree-branch-closed').addClass('ufui-tree-branch-opened');
        } else {
            this.$detail.removeClass('ufui-leaf-detail-opened').addClass('ufui-leaf-detail-closed');
            this.$branch.removeClass('ufui-tree-branch-opened').addClass('ufui-tree-branch-closed');
        }
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    setPath: function (path) {
        this.root().attr('data-path', Utils.regularDirPath(path));
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setType: function (type) {
        this.$detail.find('.ufui-leaf-folder i').attr('class', 'ufui-leaf-folder-' + type);
        return this;
    },
    getType: function () {
        var c = this.$detail.find('.ufui-leaf-folder i'),
            m = c.attr('class').match(/ufui-leaf-folder-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setTitle: function (title) {
        this.$detail.find('.ufui-leaf-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.$detail.find('.ufui-leaf-title').text();
    },
    addChild: function (ufLeaf) {
        var children = this.$branch.children();
        for (var i = 0; i < children.length; i++) {
            if (this._compare($(children[i]).ufui(), ufLeaf)) break;
        }
        if (i == 0) {
            this.$branch.prepend(ufLeaf.root());
        } else {
            $(children[i - 1]).after(ufLeaf.root());
        }
        this.expand(true);
        return this;
    },
    removeChild: function ($leaf) {
        $leaf.remove();
        return this;
    },
    getChildren: function () {
        return this.$branch.children();
    }
});


UF.ui.define('tree', {
    tpl: '<div class="ufui-tree"  >' +
    '<ul class="ufui-tree-branch ufui-tree-branch-root"></ul>' +
    '</div>',
    defaultOpt: {},
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)));
        me.$branch = me.root().find('.ufui-tree-branch');

        me._ufItems = {};

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        return this._ufItems[Utils.regularDirPath(path)];
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var path = options.path,
            $l = $.ufuileaf(options),
            ufLeaf = $l.ufui(),
            $parent = this.getItem(Utils.getParentPath(path));

        if (!this._ufItems[path]) {
            if ($parent) {
                $parent.addChild(ufLeaf);
            } else {
                this.$branch.append($l);
            }
            this._ufItems[path] = ufLeaf;
        }

        return this;
    },
    setRoot: function (options) {
        options.name = 'Root';

        var $l = $.ufuileaf(options),
            ufLeaf = $l.ufui();

        this.$branch.append($l);
        this._ufItems[options.path] = ufLeaf;
        $l.addClass('ufui-tree-leaf-root');
//        ufLeaf.expand(true);

        return this;
    },
    removeItem: function (path) {
        var me = this;
        path = Utils.regularDirPath(path);
        if (me._ufItems[path]) {
            me._ufItems[path].root().remove();
            delete me._ufItems[path];
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInTree: function (path) {
        return this.getItem(path) ? true : false;
    }
});


UF.ui.define('panel', {
    tpl: '<div class="ufui-panel"  ></div>',
    defaultOpt: {},
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});


UF.ui.define('message', {
    tpl: '<div class="ufui-message">' +
    '   <div class="ufui-message-head"><div class="ufui-message-close"></div></div>' +
    '   <div class="ufui-message-body">' +
    '       <div class="ufui-message-icon"><i class="ufui-message-icon-<%=icon%>"></i></div>' +
    '       <div class="ufui-message-info">' +
    '           <div class="ufui-message-title"><%=title%></div>' +
    '           <div class="ufui-message-loadbar"><div class="ufui-message-loadbar-percent"></div></div>' +
    '       </div>' +
    '   </div>' +
    '</div>',
    defaultOpt: {
        icon: '',
        title: ''
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().hide();

        me.$title = me.root().find('.ufui-message-title');
        me.$loadbar = me.root().find('.ufui-message-loadbar');

        //初始化进度
        me.loadedPercent = options.loadedPercent || 0;
        me.setLoadedPercent(me.loadedPercent);

        //设置关闭按钮事件
        me.root().find('.ufui-message-close').on('click', function () {
            me.hide();
        });

        //设置关闭的定时器
        if (options.timeout !== undefined && options.timeout >= 0) {
            me.timer = setTimeout(function () {
                me.hide();
            }, options.timeout);
        }

        return me;
    },
    show: function () {
        return this.root().fadeIn(400);
    },
    hide: function () {
        return this.root().fadeOut(400);
    },
    setIcon: function (icon) {
        this.root().find('.ufui-message-icon i').attr('class', 'ufui-message-icon-' + icon);
        return this;
    },
    getIcon: function () {
        var c = this.root().find('.ufui-message-icon i'),
            m = c.attr('class').match(/ufui-message-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setMessage: function (message) {
        this.$title.text(message);
        return this;
    },
    getMessage: function () {
        return this.$title.text();
    },
    setLoadedPercent: function (percent) {
        this.root().find('.ufui-message-loadbar-percent').css('width', percent + '%');
        return this;
    },
    getLoadedPercent: function () {
        return this.root().find('.ufui-message-loadbar-percent').css('width');
    },
    setTimer: function (timeout) {
        var me = this;
        if (timeout !== undefined) {
            clearTimeout(me.timer);
        }
        if (timeout >= 0) {
            me.timer = setTimeout(function () {
                me.hide();
            }, timeout);
        }
        return this;
    },
    getTimer: function () {
        return this.timer;
    }
});


//button 类
UF.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="ufui-btn ufui-btn-<%=icon%> <%if(name){%>ufui-btn-name-<%=name%><%}%>" unselectable="on" onmousedown="return false" <%}else{%>a class="ufui-text-btn"<%}%><% if(title) {%>title="<%=title%>" data-original-title="<%=title%>" <%};%>> ' +
    '<% if(icon) {%><div unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><% }; %><%if(text) {%><span unselectable="on" onmousedown="return false" class="ufui-button-label"><%=text%></span><%}%>' +
    '<%if(caret && text){%><span class="ufui-button-spacing"></span><%}%>' +
    '<% if(caret) {%><span unselectable="on" onmousedown="return false" class="ufui-caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt);
            });

        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover');
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            $.proxy(fn, this, evt)();
        }
        return this;
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.ufui-button-label').text();
        } else {
            this.root().find('.ufui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click', function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            });
        }).register('click', me.root(), function (evt) {
            $obj.hide();
        });
    }
});

/* 预览窗口 */
UF.ui.define('preview', {
    tpl: '<div class="ufui-preview">' +
    '<div class="ufui-preview-container"><center style="margin-tops:50%;"><div class="display"><div style="margin-top:140px"><b>暂无预览</b></div></div></center></div>' +
    '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else if (type1 != type2) {
            return type1 > type2;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        for (var i = 0; i < this._ufItems.length; i++) {
            if (this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for (i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (this._compare(c, ufFile)) break;
        }

        if (i >= this._ufItems.length) {
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function (path, fadeOutTime) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                if (fadeOutTime) {
                    c.active(false).root().fadeOut(fadeOutTime || 0, function () {
                        $(this).remove();
                    });
                } else {
                    c.root().remove();
                }
                break;
            }
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInList: function (path) {
        return this.getItem(path) ? true : false;
    }
});


/* 剪切板 */
UF.ui.define('clipboard', {
    tpl: '<div class="ufui-clipboard"><div class="clipboard-clear"></div>' +
    '<div class="ufui-clipboard-container"></div>' +
    '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options))).append(me.$list);
        me.$list = me.root().find('.ufui-list-container');
        // 默认拷贝状态, 否则剪切状态
        me.isCopy = true;
        me._cacheFiles = [];
        me._ufItems = [];

        return me;
    },
    _generateFileOptionsFromPath: function (p) {
        return {
            type: p.charAt(p.length - 1) == "/" ? "dir" : p.substr(p.lastIndexOf(".") + 1),
            title: p.charAt(p.length - 1) == "/" ? p.substring(p.lastIndexOf("/", p.length - 2) + 1, p.length - 1) : p.substr(p.lastIndexOf("/") + 1),
            details: "",
            path: p,
            pers: 'wr'
        };
    },
    _autoShow: function () {
        var me = this, container = me.root();
        me._cacheFiles.length == 0 ? container.removeClass("filled") : container.addClass("filled");
    },
    setIsCopy: function (c) {
        var me = this;
        if (this.isCopy != c) {
            me.clear();
            this.isCopy = c;
        }
        me.root().toggleClass("copy", this.isCopy);

    },
    getIsCopy: function () {
        return this.isCopy;
    },
    addFiles: function (files) {
        var me = this, container = me.root().find(".ufui-clipboard-container");
        $.each(files, function (i, f) {
            if (me._cacheFiles.indexOf(f) == -1) {
                me._cacheFiles = me._cacheFiles.concat(f);
                var $f = $.ufuifile(me._generateFileOptionsFromPath(f));
                container.append($f);
            }
            ;
        });
        me._autoShow();


    },
    paste: function (path) {

        return;
        var me = this, container = me.root().find(".ufui-clipboard-container");
        me._cacheFiles = [];
        container.empty();
        me._autoShow();

    },
    getPasteTarget: function (dir) {
        res = [dir].concat(this._cacheFiles);
        return res;
    },
    clear: function () {
        var me = this, container = me.root().find(".ufui-clipboard-container");
        this._cacheFiles = [];
        container.empty();
        me._autoShow();
    },
    // Inherited from list component
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else if (type1 != type2) {
            return type1 > type2;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        for (var i = 0; i < this._ufItems.length; i++) {
            if (this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for (i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (this._compare(c, ufFile)) break;
        }

        if (i >= this._ufItems.length) {
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function (path, fadeOutTime) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                if (fadeOutTime) {
                    c.active(false).root().fadeOut(fadeOutTime || 0, function () {
                        $(this).remove();
                    });
                } else {
                    c.root().remove();
                }
                break;
            }
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInList: function (path) {
        return this.getItem(path) ? true : false;
    }
});


//searchbox 类
(function () {
    UF.ui.define('searchbox', {
        tpl: '<div class="searchbox blur" >' +
        '<div class="ufui-icon-search"/><input style="float:right;" placeholder="<%=placeholder%>" type="text"/><ul class="search-ul"></ul></div>',
        init: function (options) {
            var me = this;
            var item = $($.parseTmpl(me.tpl, {"placeholder":options['placeholder']}));
            var $root = this.root(item);
        }
    });
})();


/*!
 * jQuery contextMenu - Plugin for simple contextMenu handling
 *
 * Version: 1.6.6
 *
 * Authors: Rodney Rehm, Addy Osmani (patches for FF)
 * Web: http://medialize.github.com/jQuery-contextMenu/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */

(function($, undefined){
    
    // TODO: -
        // ARIA stuff: menuitem, menuitemcheckbox und menuitemradio
        // create <menu> structure if $.support[htmlCommand || htmlMenuitem] and !opt.disableNative

// determine html5 compatibility
$.support.htmlMenuitem = ('HTMLMenuItemElement' in window);
$.support.htmlCommand = ('HTMLCommandElement' in window);
$.support.eventSelectstart = ("onselectstart" in document.documentElement);
/* // should the need arise, test for css user-select
$.support.cssUserSelect = (function(){
    var t = false,
        e = document.createElement('div');
    
    $.each('Moz|Webkit|Khtml|O|ms|Icab|'.split('|'), function(i, prefix) {
        var propCC = prefix + (prefix ? 'U' : 'u') + 'serSelect',
            prop = (prefix ? ('-' + prefix.toLowerCase() + '-') : '') + 'user-select';
            
        e.style.cssText = prop + ': text;';
        if (e.style[propCC] == 'text') {
            t = true;
            return false;
        }
        
        return true;
    });
    
    return t;
})();
*/

if (!$.ui || !$.ui.widget) {
    // duck punch $.cleanData like jQueryUI does to get that remove event
    // https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js#L16-24
    var _cleanData = $.cleanData;
    $.cleanData = function( elems ) {
        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            try {
                $( elem ).triggerHandler( "remove" );
                // http://bugs.jquery.com/ticket/8235
            } catch( e ) {}
        }
        _cleanData( elems );
    };
}

var // currently active contextMenu trigger
    $currentTrigger = null,
    // is contextMenu initialized with at least one menu?
    initialized = false,
    // window handle
    $win = $(window),
    // number of registered menus
    counter = 0,
    // mapping selector to namespace
    namespaces = {},
    // mapping namespace to options
    menus = {},
    // custom command type handlers
    types = {},
    // default values
    defaults = {
        // selector of contextMenu trigger
        selector: null,
        // where to append the menu to
        appendTo: null,
        // method to trigger context menu ["right", "left", "hover"]
        trigger: "right",
        // hide menu when mouse leaves trigger / menu elements
        autoHide: false,
        // ms to wait before showing a hover-triggered context menu
        delay: 200,
        // flag denoting if a second trigger should simply move (true) or rebuild (false) an open menu
        // as long as the trigger happened on one of the trigger-element's child nodes
        reposition: true,
        // determine position to show menu at
        determinePosition: function($menu) {
            // position to the lower middle of the trigger element
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "center top",
                    at: "center bottom",
                    of: this,
                    offset: "0 5",
                    collision: "fit"
                }).css('display', 'none');
            } else {
                // determine contextMenu position
                var offset = this.offset();
                offset.top += this.outerHeight();
                offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                $menu.css(offset);
            }
        },
        // position menu
        position: function(opt, x, y) {
            var $this = this,
                offset;
            // determine contextMenu position
            if (!x && !y) {
                opt.determinePosition.call(this, opt.$menu);
                return;
            } else if (x === "maintain" && y === "maintain") {
                // x and y must not be changed (after re-show on command click)
                offset = opt.$menu.position();
            } else {
                // x and y are given (by mouse event)
                offset = {top: y, left: x};
            }
            
            // correct offset if viewport demands it
            var bottom = $win.scrollTop() + $win.height(),
                right = $win.scrollLeft() + $win.width(),
                height = opt.$menu.height(),
                width = opt.$menu.width();
            
            if (offset.top + height > bottom) {
                offset.top -= height;
            }
            
            if (offset.left + width > right) {
                offset.left -= width;
            }
            
            opt.$menu.css(offset);
        },
        // position the sub-menu
        positionSubmenu: function($menu) {
            if ($.ui && $.ui.position) {
                // .position() is provided as a jQuery UI utility
                // (...and it won't work on hidden elements)
                $menu.css('display', 'block').position({
                    my: "left top",
                    at: "right top",
                    of: this,
                    collision: "flipfit fit"
                }).css('display', '');
            } else {
                // determine contextMenu position
                var offset = {
                    top: 0,
                    left: this.outerWidth()
                };
                $menu.css(offset);
            }
        },
        // offset to add to zIndex
        zIndex: 1,
        // show hide animation settings
        animation: {
            duration: 50,
            show: 'slideDown',
            hide: 'slideUp'
        },
        // events
        events: {
            show: $.noop,
            hide: $.noop
        },
        // default callback
        callback: null,
        // list of contextMenu items
        items: {}
    },
    // mouse position for hover activation
    hoveract = {
        timer: null,
        pageX: null,
        pageY: null
    },
    // determine zIndex
    zindex = function($t) {
        var zin = 0,
            $tt = $t;

        while (true) {
            zin = Math.max(zin, parseInt($tt.css('z-index'), 10) || 0);
            $tt = $tt.parent();
            if (!$tt || !$tt.length || "html body".indexOf($tt.prop('nodeName').toLowerCase()) > -1 ) {
                break;
            }
        }
        
        return zin;
    },
    // event handlers
    handle = {
        // abort anything
        abortevent: function(e){
            e.preventDefault();
            e.stopImmediatePropagation();
        },
        
        // contextmenu show dispatcher
        contextmenu: function(e) {
            var $this = $(this);
            
            // disable actual context-menu
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // abort native-triggered events unless we're triggering on right click
            if (e.data.trigger != 'right' && e.originalEvent) {
                return;
            }
            
            // abort event if menu is visible for this trigger
            if ($this.hasClass('context-menu-active')) {
                return;
            }
            
            if (!$this.hasClass('context-menu-disabled')) {
                // theoretically need to fire a show event at <menu>
                // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#context-menus
                // var evt = jQuery.Event("show", { data: data, pageX: e.pageX, pageY: e.pageY, relatedTarget: this });
                // e.data.$menu.trigger(evt);
                
                $currentTrigger = $this;
                if (e.data.build) {
                    var built = e.data.build($currentTrigger, e);
                    // abort if build() returned false
                    if (built === false) {
                        return;
                    }
                    
                    // dynamically build menu on invocation
                    e.data = $.extend(true, {}, defaults, e.data, built || {});

                    // abort if there are no items to display
                    if (!e.data.items || $.isEmptyObject(e.data.items)) {
                        // Note: jQuery captures and ignores errors from event handlers
                        if (window.console) {
                            (console.error || console.log)("No items specified to show in contextMenu");
                        }
                        
                        throw new Error('No Items specified');
                    }
                    
                    // backreference for custom command type creation
                    e.data.$trigger = $currentTrigger;
                    
                    op.create(e.data);
                }
                // show menu
                op.show.call($this, e.data, e.pageX, e.pageY);
            }
        },
        // contextMenu left-click trigger
        click: function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
        },
        // contextMenu right-click trigger
        mousedown: function(e) {
            // register mouse down
            var $this = $(this);
            
            // hide any previous menus
            if ($currentTrigger && $currentTrigger.length && !$currentTrigger.is($this)) {
                $currentTrigger.data('contextMenu').$menu.trigger('contextmenu:hide');
            }
            
            // activate on right click
            if (e.button == 2) {
                $currentTrigger = $this.data('contextMenuActive', true);
            }
        },
        // contextMenu right-click trigger
        mouseup: function(e) {
            // show menu
            var $this = $(this);
            if ($this.data('contextMenuActive') && $currentTrigger && $currentTrigger.length && $currentTrigger.is($this) && !$this.hasClass('context-menu-disabled')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                $currentTrigger = $this;
                $this.trigger($.Event("contextmenu", { data: e.data, pageX: e.pageX, pageY: e.pageY }));
            }

            $this.removeData('contextMenuActive');
        },
        // contextMenu hover trigger
        mouseenter: function(e) {
            var $this = $(this),
                $related = $(e.relatedTarget),
                $document = $(document);
            
            // abort if we're coming from a menu
            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }
            
            // abort if a menu is shown
            if ($currentTrigger && $currentTrigger.length) {
                return;
            }
            
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
            hoveract.data = e.data;
            $document.on('mousemove.contextMenuShow', handle.mousemove);
            hoveract.timer = setTimeout(function() {
                hoveract.timer = null;
                $document.off('mousemove.contextMenuShow');
                $currentTrigger = $this;
                $this.trigger($.Event("contextmenu", { data: hoveract.data, pageX: hoveract.pageX, pageY: hoveract.pageY }));
            }, e.data.delay );
        },
        // contextMenu hover trigger
        mousemove: function(e) {
            hoveract.pageX = e.pageX;
            hoveract.pageY = e.pageY;
        },
        // contextMenu hover trigger
        mouseleave: function(e) {
            // abort if we're leaving for a menu
            var $related = $(e.relatedTarget);
            if ($related.is('.context-menu-list') || $related.closest('.context-menu-list').length) {
                return;
            }
            
            try {
                clearTimeout(hoveract.timer);
            } catch(e) {}
            
            hoveract.timer = null;
        },
        
        // click on layer to hide contextMenu
        layerClick: function(e) {

            var $this = $(this),
                root = $this.data('contextMenuRoot'),
                mouseup = false,
                button = e.button,
                x = e.pageX,
                y = e.pageY,
                target, 
                offset,
                selectors;
            e.preventDefault();
            e.stopImmediatePropagation();
            
            setTimeout(function() {
                var $window, hideshow, possibleTarget;
                var triggerAction = ((root.trigger == 'left' && button === 0) || (root.trigger == 'right' && button === 2));
                
                // find the element that would've been clicked, wasn't the layer in the way
                if (document.elementFromPoint) {
                    root.$layer.hide();
                    target = document.elementFromPoint(x - $win.scrollLeft(), y - $win.scrollTop());
                    root.$layer.show();
                }
                
                if (root.reposition && triggerAction) {
                    if (document.elementFromPoint) {
                        if (root.$trigger.is(target) || root.$trigger.has(target).length) {
                            root.position.call(root.$trigger, root, x, y);
                            return;
                        }
                    } else {
                        offset = root.$trigger.offset();
                        $window = $(window);
                        // while this looks kinda awful, it's the best way to avoid
                        // unnecessarily calculating any positions
                        offset.top += $window.scrollTop();
                        if (offset.top <= e.pageY) {
                            offset.left += $window.scrollLeft();
                            if (offset.left <= e.pageX) {
                                offset.bottom = offset.top + root.$trigger.outerHeight();
                                if (offset.bottom >= e.pageY) {
                                    offset.right = offset.left + root.$trigger.outerWidth();
                                    if (offset.right >= e.pageX) {
                                        // reposition
                                        root.position.call(root.$trigger, root, x, y);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (target && triggerAction) {
                    root.$trigger.one('contextmenu:hidden', function() {
                        $(target).contextMenu({x: x, y: y});
                    });
                }

                root.$menu.trigger('contextmenu:hide');
            }, 50);
        },
        // key handled :hover
        keyStop: function(e, opt) {
            if (!opt.isInput) {
                e.preventDefault();
            }
            
            e.stopPropagation();
        },
        key: function(e) {
            var opt = $currentTrigger.data('contextMenu') || {};

            switch (e.keyCode) {
                case 9:
                case 38: // up
                    handle.keyStop(e, opt);
                    // if keyCode is [38 (up)] or [9 (tab) with shift]
                    if (opt.isInput) {
                        if (e.keyCode == 9 && e.shiftKey) {
                            e.preventDefault();
                            opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            opt.$menu.trigger('prevcommand');
                            return;
                        } else if (e.keyCode == 38 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else if (e.keyCode != 9 || e.shiftKey) {
                        opt.$menu.trigger('prevcommand');
                        return;
                    }
                    // omitting break;
                    
                // case 9: // tab - reached through omitted break;
                case 40: // down
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (e.keyCode == 9) {
                            e.preventDefault();
                            opt.$selected && opt.$selected.find('input, textarea, select').blur();
                            opt.$menu.trigger('nextcommand');
                            return;
                        } else if (e.keyCode == 40 && opt.$selected.find('input, textarea, select').prop('type') == 'checkbox') {
                            // checkboxes don't capture this key
                            e.preventDefault();
                            return;
                        }
                    } else {
                        opt.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 37: // left
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                
                    if (!opt.$selected.parent().hasClass('context-menu-root')) {
                        var $parent = opt.$selected.parent().parent();
                        opt.$selected.trigger('contextmenu:blur');
                        opt.$selected = $parent;
                        return;
                    }
                    break;
                    
                case 39: // right
                    handle.keyStop(e, opt);
                    if (opt.isInput || !opt.$selected || !opt.$selected.length) {
                        break;
                    }
                    
                    var itemdata = opt.$selected.data('contextMenu') || {};
                    if (itemdata.$menu && opt.$selected.hasClass('context-menu-submenu')) {
                        opt.$selected = null;
                        itemdata.$selected = null;
                        itemdata.$menu.trigger('nextcommand');
                        return;
                    }
                    break;
                
                case 35: // end
                case 36: // home
                    if (opt.$selected && opt.$selected.find('input, textarea, select').length) {
                        return;
                    } else {
                        (opt.$selected && opt.$selected.parent() || opt.$menu)
                            .children(':not(.disabled, .not-selectable)')[e.keyCode == 36 ? 'first' : 'last']()
                            .trigger('contextmenu:focus');
                        e.preventDefault();
                        return;
                    }
                    break;
                    
                case 13: // enter
                    handle.keyStop(e, opt);
                    if (opt.isInput) {
                        if (opt.$selected && !opt.$selected.is('textarea, select')) {
                            e.preventDefault();
                            return;
                        }
                        break;
                    }
                    opt.$selected && opt.$selected.trigger('mouseup');
                    return;
                    
                case 32: // space
                case 33: // page up
                case 34: // page down
                    // prevent browser from scrolling down while menu is visible
                    handle.keyStop(e, opt);
                    return;
                    
                case 27: // esc
                    handle.keyStop(e, opt);
                    opt.$menu.trigger('contextmenu:hide');
                    return;
                    
                default: // 0-9, a-z
                    var k = (String.fromCharCode(e.keyCode)).toUpperCase();
                    if (opt.accesskeys[k]) {
                        // according to the specs accesskeys must be invoked immediately
                        opt.accesskeys[k].$node.trigger(opt.accesskeys[k].$menu
                            ? 'contextmenu:focus'
                            : 'mouseup'
                        );
                        return;
                    }
                    break;
            }
            // pass event to selected item, 
            // stop propagation to avoid endless recursion
            e.stopPropagation();
            opt.$selected && opt.$selected.trigger(e);
        },

        // select previous possible command in menu
        prevItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }
            
            var $children = opt.$menu.children(),
                $prev = !opt.$selected || !opt.$selected.prev().length ? $children.last() : opt.$selected.prev(),
                $round = $prev;
            
            // skip disabled
            while ($prev.hasClass('disabled') || $prev.hasClass('not-selectable')) {
                if ($prev.prev().length) {
                    $prev = $prev.prev();
                } else {
                    $prev = $children.last();
                }
                if ($prev.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($prev.get(0), e);
            
            // focus input
            var $input = $prev.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        // select next possible command in menu
        nextItem: function(e) {
            e.stopPropagation();
            var opt = $(this).data('contextMenu') || {};

            // obtain currently selected menu
            if (opt.$selected) {
                var $s = opt.$selected;
                opt = opt.$selected.parent().data('contextMenu') || {};
                opt.$selected = $s;
            }

            var $children = opt.$menu.children(),
                $next = !opt.$selected || !opt.$selected.next().length ? $children.first() : opt.$selected.next(),
                $round = $next;

            // skip disabled
            while ($next.hasClass('disabled') || $next.hasClass('not-selectable')) {
                if ($next.next().length) {
                    $next = $next.next();
                } else {
                    $next = $children.first();
                }
                if ($next.is($round)) {
                    // break endless loop
                    return;
                }
            }
            
            // leave current
            if (opt.$selected) {
                handle.itemMouseleave.call(opt.$selected.get(0), e);
            }
            
            // activate next
            handle.itemMouseenter.call($next.get(0), e);
            
            // focus input
            var $input = $next.find('input, textarea, select');
            if ($input.length) {
                $input.focus();
            }
        },
        
        // flag that we're inside an input so the key handler can act accordingly
        focusInput: function(e) {
            var $this = $(this).closest('.context-menu-item'),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            root.$selected = opt.$selected = $this;
            root.isInput = opt.isInput = true;
        },
        // flag that we're inside an input so the key handler can act accordingly
        blurInput: function(e) {
            var $this = $(this).closest('.context-menu-item'),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            root.isInput = opt.isInput = false;
        },
        
        // :hover on menu
        menuMouseenter: function(e) {
            var root = $(this).data().contextMenuRoot;
            root.hovering = true;
        },
        // :hover on menu
        menuMouseleave: function(e) {
            var root = $(this).data().contextMenuRoot;
            if (root.$layer && root.$layer.is(e.relatedTarget)) {
                root.hovering = false;
            }
        },
        
        // :hover done manually so key handling is possible
        itemMouseenter: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;
            
            root.hovering = true;

            // abort if we're re-entering
            if (e && root.$layer && root.$layer.is(e.relatedTarget)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }

            // make sure only one item is selected
            (opt.$menu ? opt : root).$menu
                .children('.hover').trigger('contextmenu:blur');

            if ($this.hasClass('disabled') || $this.hasClass('not-selectable')) {
                opt.$selected = null;
                return;
            }
            
            $this.trigger('contextmenu:focus');
        },
        // :hover done manually so key handling is possible
        itemMouseleave: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            if (root !== opt && root.$layer && root.$layer.is(e.relatedTarget)) {
                root.$selected && root.$selected.trigger('contextmenu:blur');
                e.preventDefault();
                e.stopImmediatePropagation();
                root.$selected = opt.$selected = opt.$node;
                return;
            }
            
            $this.trigger('contextmenu:blur');
        },
        // contextMenu item click
        itemClick: function(e) {
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot,
                key = data.contextMenuKey,
                callback;

            // abort if the key is unknown or disabled or is a menu
            if (!opt.items[key] || $this.is('.disabled, .context-menu-submenu, .context-menu-separator, .not-selectable')) {
                return;
            }

            e.preventDefault();
            e.stopImmediatePropagation();

            if ($.isFunction(root.callbacks[key]) && Object.prototype.hasOwnProperty.call(root.callbacks, key)) {
                // item-specific callback
                callback = root.callbacks[key];
            } else if ($.isFunction(root.callback)) {
                // default callback
                callback = root.callback;                
            } else {
                // no callback, no action
                return;
            }

            // hide menu if callback doesn't stop that
            if (callback.call(root.$trigger, key, root) !== false) {
                root.$menu.trigger('contextmenu:hide');
            } else if (root.$menu.parent().length) {
                op.update.call(root.$trigger, root);
            }
        },
        // ignore click events on input elements
        inputClick: function(e) {
            e.stopImmediatePropagation();
        },
        
        // hide <menu>
        hideMenu: function(e, data) {
            var root = $(this).data('contextMenuRoot');
            op.hide.call(root.$trigger, root, data && data.force);
        },
        // focus <command>
        focusItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;

            $this.addClass('hover')
                .siblings('.hover').trigger('contextmenu:blur');
            
            // remember selected
            opt.$selected = root.$selected = $this;
            
            // position sub-menu - do after show so dumb $.ui.position can keep up
            if (opt.$node) {
                root.positionSubmenu.call(opt.$node, opt.$menu);
            }
        },
        // blur <command>
        blurItem: function(e) {
            e.stopPropagation();
            var $this = $(this),
                data = $this.data(),
                opt = data.contextMenu,
                root = data.contextMenuRoot;
            
            $this.removeClass('hover');
            opt.$selected = null;
        }
    },
    // operations
    op = {
        show: function(opt, x, y) {
            var $trigger = $(this),
                offset,
                css = {};

            // hide any open menus
            $('#context-menu-layer').trigger('mousedown');

            // backreference for callbacks
            opt.$trigger = $trigger;

            // show event
            if (opt.events.show.call($trigger, opt) === false) {
                $currentTrigger = null;
                return;
            }

            // create or update context menu
            op.update.call($trigger, opt);
            
            // position menu
            opt.position.call($trigger, opt, x, y);

            // make sure we're in front
            if (opt.zIndex) {
                css.zIndex = zindex($trigger) + opt.zIndex;
            }
            
            // add layer
            op.layer.call(opt.$menu, opt, css.zIndex);
            
            // adjust sub-menu zIndexes
            opt.$menu.find('ul').css('zIndex', css.zIndex + 1);
            
            // position and show context menu
            opt.$menu.css( css )[opt.animation.show](opt.animation.duration, function() {
                $trigger.trigger('contextmenu:visible');
            });
            // make options available and set state
            $trigger
                .data('contextMenu', opt)
                .addClass("context-menu-active");
            
            // register key handler
            $(document).off('keydown.contextMenu').on('keydown.contextMenu', handle.key);
            // register autoHide handler
            if (opt.autoHide) {
                // mouse position handler
                $(document).on('mousemove.contextMenuAutoHide', function(e) {
                    // need to capture the offset on mousemove,
                    // since the page might've been scrolled since activation
                    var pos = $trigger.offset();
                    pos.right = pos.left + $trigger.outerWidth();
                    pos.bottom = pos.top + $trigger.outerHeight();
                    
                    if (opt.$layer && !opt.hovering && (!(e.pageX >= pos.left && e.pageX <= pos.right) || !(e.pageY >= pos.top && e.pageY <= pos.bottom))) {
                        // if mouse in menu...
                        opt.$menu.trigger('contextmenu:hide');
                    }
                });
            }
        },
        hide: function(opt, force) {
            var $trigger = $(this);
            if (!opt) {
                opt = $trigger.data('contextMenu') || {};
            }
            
            // hide event
            if (!force && opt.events && opt.events.hide.call($trigger, opt) === false) {
                return;
            }
            
            // remove options and revert state
            $trigger
                .removeData('contextMenu')
                .removeClass("context-menu-active");
            
            if (opt.$layer) {
                // keep layer for a bit so the contextmenu event can be aborted properly by opera
                setTimeout((function($layer) {
                    return function(){
                        $layer.remove();
                    };
                })(opt.$layer), 10);
                
                try {
                    delete opt.$layer;
                } catch(e) {
                    opt.$layer = null;
                }
            }
            
            // remove handle
            $currentTrigger = null;
            // remove selected
            opt.$menu.find('.hover').trigger('contextmenu:blur');
            opt.$selected = null;
            // unregister key and mouse handlers
            //$(document).off('.contextMenuAutoHide keydown.contextMenu'); // http://bugs.jquery.com/ticket/10705
            $(document).off('.contextMenuAutoHide').off('keydown.contextMenu');
            // hide menu
            opt.$menu && opt.$menu[opt.animation.hide](opt.animation.duration, function (){
                // tear down dynamically built menu after animation is completed.
                if (opt.build) {
                    opt.$menu.remove();
                    $.each(opt, function(key, value) {
                        switch (key) {
                            case 'ns':
                            case 'selector':
                            case 'build':
                            case 'trigger':
                                return true;

                            default:
                                opt[key] = undefined;
                                try {
                                    delete opt[key];
                                } catch (e) {}
                                return true;
                        }
                    });
                }
                
                setTimeout(function() {
                    $trigger.trigger('contextmenu:hidden');
                }, 10);
            });
        },
        create: function(opt, root) {
            if (root === undefined) {
                root = opt;
            }
            // create contextMenu
            opt.$menu = $('<ul class="context-menu-list"></ul>').addClass(opt.className || "").data({
                'contextMenu': opt,
                'contextMenuRoot': root
            });
            
            $.each(['callbacks', 'commands', 'inputs'], function(i,k){
                opt[k] = {};
                if (!root[k]) {
                    root[k] = {};
                }
            });
            
            root.accesskeys || (root.accesskeys = {});
            
            // create contextMenu items
            $.each(opt.items, function(key, item){
                var $t = $('<li class="context-menu-item"></li>').addClass(item.className || ""),
                    $label = null,
                    $input = null;
                
                // iOS needs to see a click-event bound to an element to actually
                // have the TouchEvents infrastructure trigger the click event
                $t.on('click', $.noop);
                
                item.$node = $t.data({
                    'contextMenu': opt,
                    'contextMenuRoot': root,
                    'contextMenuKey': key
                });
                
                // register accesskey
                // NOTE: the accesskey attribute should be applicable to any element, but Safari5 and Chrome13 still can't do that
                if (item.accesskey) {
                    var aks = splitAccesskey(item.accesskey);
                    for (var i=0, ak; ak = aks[i]; i++) {
                        if (!root.accesskeys[ak]) {
                            root.accesskeys[ak] = item;
                            item._name = item.name.replace(new RegExp('(' + ak + ')', 'i'), '<span class="context-menu-accesskey">$1</span>');
                            break;
                        }
                    }
                }
                
                if (typeof item == "string") {
                    $t.addClass('context-menu-separator not-selectable');
                } else if (item.type && types[item.type]) {
                    // run custom type handler
                    types[item.type].call($t, item, opt, root);
                    // register commands
                    $.each([opt, root], function(i,k){
                        k.commands[key] = item;
                        if ($.isFunction(item.callback)) {
                            k.callbacks[key] = item.callback;
                        }
                    });
                } else {
                    // add label for input
                    if (item.type == 'html') {
                        $t.addClass('context-menu-html not-selectable');
                    } else if (item.type) {
                        $label = $('<label></label>').appendTo($t);
                        $('<span></span>').html(item._name || item.name).appendTo($label);
                        $t.addClass('context-menu-input');
                        opt.hasTypes = true;
                        $.each([opt, root], function(i,k){
                            k.commands[key] = item;
                            k.inputs[key] = item;
                        });
                    } else if (item.items) {
                        item.type = 'sub';
                    }
                
                    switch (item.type) {
                        case 'text':
                            $input = $('<input type="text" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .appendTo($label);
                            break;
                    
                        case 'textarea':
                            $input = $('<textarea name=""></textarea>')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .appendTo($label);

                            if (item.height) {
                                $input.height(item.height);
                            }
                            break;

                        case 'checkbox':
                            $input = $('<input type="checkbox" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + key)
                                .val(item.value || "")
                                .prop("checked", !!item.selected)
                                .prependTo($label);
                            break;

                        case 'radio':
                            $input = $('<input type="radio" value="1" name="" value="">')
                                .attr('name', 'context-menu-input-' + item.radio)
                                .val(item.value || "")
                                .prop("checked", !!item.selected)
                                .prependTo($label);
                            break;
                    
                        case 'select':
                            $input = $('<select name="">')
                                .attr('name', 'context-menu-input-' + key)
                                .appendTo($label);
                            if (item.options) {
                                $.each(item.options, function(value, text) {
                                    $('<option></option>').val(value).text(text).appendTo($input);
                                });
                                $input.val(item.selected);
                            }
                            break;
                        
                        case 'sub':
                            // FIXME: shouldn't this .html() be a .text()?
                            $('<span></span>').html(item._name || item.name).appendTo($t);
                            item.appendTo = item.$node;
                            op.create(item, root);
                            $t.data('contextMenu', item).addClass('context-menu-submenu');
                            item.callback = null;
                            break;
                        
                        case 'html':
                            $(item.html).appendTo($t);
                            break;
                        
                        default:
                            $.each([opt, root], function(i,k){
                                k.commands[key] = item;
                                if ($.isFunction(item.callback)) {
                                    k.callbacks[key] = item.callback;
                                }
                            });
                            // FIXME: shouldn't this .html() be a .text()?
                            $('<span></span>').html(item._name || item.name || "").appendTo($t);
                            break;
                    }
                    
                    // disable key listener in <input>
                    if (item.type && item.type != 'sub' && item.type != 'html') {
                        $input
                            .on('focus', handle.focusInput)
                            .on('blur', handle.blurInput);
                        
                        if (item.events) {
                            $input.on(item.events, opt);
                        }
                    }
                
                    // add icons
                    if (item.icon) {
                        $t.addClass("icon icon-" + item.icon);
                    }
                }
                
                // cache contained elements
                item.$input = $input;
                item.$label = $label;

                // attach item to menu
                $t.appendTo(opt.$menu);
                
                // Disable text selection
                if (!opt.hasTypes && $.support.eventSelectstart) {
                    // browsers support user-select: none, 
                    // IE has a special event for text-selection
                    // browsers supporting neither will not be preventing text-selection
                    $t.on('selectstart.disableTextSelect', handle.abortevent);
                }
            });
            // attach contextMenu to <body> (to bypass any possible overflow:hidden issues on parents of the trigger element)
            if (!opt.$node) {
                opt.$menu.css('display', 'none').addClass('context-menu-root');
            }
            opt.$menu.appendTo(opt.appendTo || document.body);
        },
        resize: function($menu, nested) {
            // determine widths of submenus, as CSS won't grow them automatically
            // position:absolute within position:absolute; min-width:100; max-width:200; results in width: 100;
            // kinda sucks hard...

            // determine width of absolutely positioned element
            $menu.css({position: 'absolute', display: 'block'});
            // don't apply yet, because that would break nested elements' widths
            // add a pixel to circumvent word-break issue in IE9 - #80
            $menu.data('width', Math.ceil($menu.width()) + 1);
            // reset styles so they allow nested elements to grow/shrink naturally
            $menu.css({
                position: 'static',
                minWidth: '0px',
                maxWidth: '100000px'
            });
            // identify width of nested menus
            $menu.find('> li > ul').each(function() {
                op.resize($(this), true);
            });
            // reset and apply changes in the end because nested
            // elements' widths wouldn't be calculatable otherwise
            if (!nested) {
                $menu.find('ul').andSelf().css({
                    position: '', 
                    display: '',
                    minWidth: '',
                    maxWidth: ''
                }).width(function() {
                    return $(this).data('width');
                });
            }
        },
        update: function(opt, root) {
            var $trigger = this;
            if (root === undefined) {
                root = opt;
                op.resize(opt.$menu);
            }
            // re-check disabled for each item
            opt.$menu.children().each(function(){
                var $item = $(this),
                    key = $item.data('contextMenuKey'),
                    item = opt.items[key],
                    disabled = ($.isFunction(item.disabled) && item.disabled.call($trigger, key, root)) || item.disabled === true;

                // dis- / enable item
                $item[disabled ? 'addClass' : 'removeClass']('disabled');
                
                if (item.type) {
                    // dis- / enable input elements
                    $item.find('input, select, textarea').prop('disabled', disabled);
                    
                    // update input states
                    switch (item.type) {
                        case 'text':
                        case 'textarea':
                            item.$input.val(item.value || "");
                            break;
                            
                        case 'checkbox':
                        case 'radio':
                            item.$input.val(item.value || "").prop('checked', !!item.selected);
                            break;
                            
                        case 'select':
                            item.$input.val(item.selected || "");
                            break;
                    }
                }
                
                if (item.$menu) {
                    // update sub-menu
                    op.update.call($trigger, item, root);
                }
            });
        },
        layer: function(opt, zIndex) {
            // add transparent layer for click area
            // filter and background for Internet Explorer, Issue #23
            var $layer = opt.$layer = $('<div id="context-menu-layer" style="position:fixed; z-index:' + zIndex + '; top:0; left:0; opacity: 0; filter: alpha(opacity=0); background-color: #000;"></div>')
                .css({height: $win.height(), width: $win.width(), display: 'block'})
                .data('contextMenuRoot', opt)
                .insertBefore(this)
                .on('contextmenu', handle.abortevent)
                .on('mousedown', handle.layerClick);
            
            // IE6 doesn't know position:fixed;
            if (!$.support.fixedPosition) {
                $layer.css({
                    'position' : 'absolute',
                    'height' : $(document).height()
                });
            }
            
            return $layer;
        }
    };

// split accesskey according to http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#assigned-access-key
function splitAccesskey(val) {
    var t = val.split(/\s+/),
        keys = [];
        
    for (var i=0, k; k = t[i]; i++) {
        k = k[0].toUpperCase(); // first character only
        // theoretically non-accessible characters should be ignored, but different systems, different keyboard layouts, ... screw it.
        // a map to look up already used access keys would be nice
        keys.push(k);
    }
    
    return keys;
}

// handle contextMenu triggers
$.fn.contextMenu = function(operation) {
    if (operation === undefined) {
        this.first().trigger('contextmenu');
    } else if (operation.x && operation.y) {
        this.first().trigger($.Event("contextmenu", {pageX: operation.x, pageY: operation.y}));
    } else if (operation === "hide") {
        var $menu = this.data('contextMenu').$menu;
        $menu && $menu.trigger('contextmenu:hide');
    } else if (operation === "destroy") {
        $.contextMenu("destroy", {context: this});
    } else if ($.isPlainObject(operation)) {
        operation.context = this;
        $.contextMenu("create", operation);
    } else if (operation) {
        this.removeClass('context-menu-disabled');
    } else if (!operation) {
        this.addClass('context-menu-disabled');
    }
    
    return this;
};

// manage contextMenu instances
$.contextMenu = function(operation, options) {
    if (typeof operation != 'string') {
        options = operation;
        operation = 'create';
    }
    
    if (typeof options == 'string') {
        options = {selector: options};
    } else if (options === undefined) {
        options = {};
    }
    
    // merge with default options
    var o = $.extend(true, {}, defaults, options || {});
    var $document = $(document);
    var $context = $document;
    var _hasContext = false;
    
    if (!o.context || !o.context.length) {
        o.context = document;
    } else {
        // you never know what they throw at you...
        $context = $(o.context).first();
        o.context = $context.get(0);
        _hasContext = o.context !== document;
    }
    
    switch (operation) {
        case 'create':
            // no selector no joy
            if (!o.selector) {
                throw new Error('No selector specified');
            }
            // make sure internal classes are not bound to
            if (o.selector.match(/.context-menu-(list|item|input)($|\s)/)) {
                throw new Error('Cannot bind to selector "' + o.selector + '" as it contains a reserved className');
            }
            if (!o.build && (!o.items || $.isEmptyObject(o.items))) {
                throw new Error('No Items specified');
            }
            counter ++;
            o.ns = '.contextMenu' + counter;
            if (!_hasContext) {
                namespaces[o.selector] = o.ns;
            }
            menus[o.ns] = o;
            
            // default to right click
            if (!o.trigger) {
                o.trigger = 'right';
            }
            
            if (!initialized) {
                // make sure item click is registered first
                $document
                    .on({
                        'contextmenu:hide.contextMenu': handle.hideMenu,
                        'prevcommand.contextMenu': handle.prevItem,
                        'nextcommand.contextMenu': handle.nextItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.menuMouseenter,
                        'mouseleave.contextMenu': handle.menuMouseleave
                    }, '.context-menu-list')
                    .on('mouseup.contextMenu', '.context-menu-input', handle.inputClick)
                    .on({
                        'mouseup.contextMenu': handle.itemClick,
                        'contextmenu:focus.contextMenu': handle.focusItem,
                        'contextmenu:blur.contextMenu': handle.blurItem,
                        'contextmenu.contextMenu': handle.abortevent,
                        'mouseenter.contextMenu': handle.itemMouseenter,
                        'mouseleave.contextMenu': handle.itemMouseleave
                    }, '.context-menu-item');

                initialized = true;
            }
            
            // engage native contextmenu event
            $context
                .on('contextmenu' + o.ns, o.selector, o, handle.contextmenu);
            
            if (_hasContext) {
                // add remove hook, just in case
                $context.on('remove' + o.ns, function() {
                    $(this).contextMenu("destroy");
                });
            }
            
            switch (o.trigger) {
                case 'hover':
                        $context
                            .on('mouseenter' + o.ns, o.selector, o, handle.mouseenter)
                            .on('mouseleave' + o.ns, o.selector, o, handle.mouseleave);                    
                    break;
                    
                case 'left':
                        $context.on('click' + o.ns, o.selector, o, handle.click);
                    break;
                /*
                default:
                    // http://www.quirksmode.org/dom/events/contextmenu.html
                    $document
                        .on('mousedown' + o.ns, o.selector, o, handle.mousedown)
                        .on('mouseup' + o.ns, o.selector, o, handle.mouseup);
                    break;
                */
            }
            
            // create menu
            if (!o.build) {
                op.create(o);
            }
            break;
        
        case 'destroy':
            var $visibleMenu;
            if (_hasContext) {
                // get proper options 
                var context = o.context;
                $.each(menus, function(ns, o) {
                    if (o.context !== context) {
                        return true;
                    }
                    
                    $visibleMenu = $('.context-menu-list').filter(':visible');
                    if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is($(o.context).find(o.selector))) {
                        $visibleMenu.trigger('contextmenu:hide', {force: true});
                    }

                    try {
                        if (menus[o.ns].$menu) {
                            menus[o.ns].$menu.remove();
                        }

                        delete menus[o.ns];
                    } catch(e) {
                        menus[o.ns] = null;
                    }

                    $(o.context).off(o.ns);
                    
                    return true;
                });
            } else if (!o.selector) {
                $document.off('.contextMenu .contextMenuAutoHide');
                $.each(menus, function(ns, o) {
                    $(o.context).off(o.ns);
                });
                
                namespaces = {};
                menus = {};
                counter = 0;
                initialized = false;
                
                $('#context-menu-layer, .context-menu-list').remove();
            } else if (namespaces[o.selector]) {
                $visibleMenu = $('.context-menu-list').filter(':visible');
                if ($visibleMenu.length && $visibleMenu.data().contextMenuRoot.$trigger.is(o.selector)) {
                    $visibleMenu.trigger('contextmenu:hide', {force: true});
                }
                
                try {
                    if (menus[namespaces[o.selector]].$menu) {
                        menus[namespaces[o.selector]].$menu.remove();
                    }
                    
                    delete menus[namespaces[o.selector]];
                } catch(e) {
                    menus[namespaces[o.selector]] = null;
                }
                
                $document.off(namespaces[o.selector]);
            }
            break;
        
        case 'html5':
            // if <command> or <menuitem> are not handled by the browser,
            // or options was a bool true,
            // initialize $.contextMenu for them
            if ((!$.support.htmlCommand && !$.support.htmlMenuitem) || (typeof options == "boolean" && options)) {
                $('menu[type="context"]').each(function() {
                    if (this.id) {
                        $.contextMenu({
                            selector: '[contextmenu=' + this.id +']',
                            items: $.contextMenu.fromMenu(this)
                        });
                    }
                }).css('display', 'none');
            }
            break;
        
        default:
            throw new Error('Unknown operation "' + operation + '"');
    }
    
    return this;
};

// import values into <input> commands
$.contextMenu.setInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
            case 'textarea':
                item.value = data[key] || "";
                break;

            case 'checkbox':
                item.selected = data[key] ? true : false;
                break;
                
            case 'radio':
                item.selected = (data[item.radio] || "") == item.value ? true : false;
                break;
            
            case 'select':
                item.selected = data[key] || "";
                break;
        }
    });
};

// export values from <input> commands
$.contextMenu.getInputValues = function(opt, data) {
    if (data === undefined) {
        data = {};
    }
    
    $.each(opt.inputs, function(key, item) {
        switch (item.type) {
            case 'text':
            case 'textarea':
            case 'select':
                data[key] = item.$input.val();
                break;

            case 'checkbox':
                data[key] = item.$input.prop('checked');
                break;
                
            case 'radio':
                if (item.$input.prop('checked')) {
                    data[item.radio] = item.value;
                }
                break;
        }
    });
    
    return data;
};

// find <label for="xyz">
function inputLabel(node) {
    return (node.id && $('label[for="'+ node.id +'"]').val()) || node.name;
}

// convert <menu> to items object
function menuChildren(items, $children, counter) {
    if (!counter) {
        counter = 0;
    }
    
    $children.each(function() {
        var $node = $(this),
            node = this,
            nodeName = this.nodeName.toLowerCase(),
            label,
            item;
        
        // extract <label><input>
        if (nodeName == 'label' && $node.find('input, textarea, select').length) {
            label = $node.text();
            $node = $node.children().first();
            node = $node.get(0);
            nodeName = node.nodeName.toLowerCase();
        }
        
        /*
         * <menu> accepts flow-content as children. that means <embed>, <canvas> and such are valid menu items.
         * Not being the sadistic kind, $.contextMenu only accepts:
         * <command>, <menuitem>, <hr>, <span>, <p> <input [text, radio, checkbox]>, <textarea>, <select> and of course <menu>.
         * Everything else will be imported as an html node, which is not interfaced with contextMenu.
         */
        
        // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#concept-command
        switch (nodeName) {
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/interactive-elements.html#the-menu-element
            case 'menu':
                item = {name: $node.attr('label'), items: {}};
                counter = menuChildren(item.items, $node.children(), counter);
                break;
            
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-a-element-to-define-a-command
            case 'a':
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-button-element-to-define-a-command
            case 'button':
                item = {
                    name: $node.text(),
                    disabled: !!$node.attr('disabled'),
                    callback: (function(){ return function(){ $node.click(); }; })()
                };
                break;
            
            // http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#using-the-command-element-to-define-a-command

            case 'menuitem':
            case 'command':
                switch ($node.attr('type')) {
                    case undefined:
                    case 'command':
                    case 'menuitem':
                        item = {
                            name: $node.attr('label'),
                            disabled: !!$node.attr('disabled'),
                            callback: (function(){ return function(){ $node.click(); }; })()
                        };
                        break;
                        
                    case 'checkbox':
                        item = {
                            type: 'checkbox',
                            disabled: !!$node.attr('disabled'),
                            name: $node.attr('label'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    case 'radio':
                        item = {
                            type: 'radio',
                            disabled: !!$node.attr('disabled'),
                            name: $node.attr('label'),
                            radio: $node.attr('radiogroup'),
                            value: $node.attr('id'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    default:
                        item = undefined;
                }
                break;
 
            case 'hr':
                item = '-------';
                break;
                
            case 'input':
                switch ($node.attr('type')) {
                    case 'text':
                        item = {
                            type: 'text',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            value: $node.val()
                        };
                        break;
                        
                    case 'checkbox':
                        item = {
                            type: 'checkbox',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            selected: !!$node.attr('checked')
                        };
                        break;
                        
                    case 'radio':
                        item = {
                            type: 'radio',
                            name: label || inputLabel(node),
                            disabled: !!$node.attr('disabled'),
                            radio: !!$node.attr('name'),
                            value: $node.val(),
                            selected: !!$node.attr('checked')
                        };
                        break;
                    
                    default:
                        item = undefined;
                        break;
                }
                break;
                
            case 'select':
                item = {
                    type: 'select',
                    name: label || inputLabel(node),
                    disabled: !!$node.attr('disabled'),
                    selected: $node.val(),
                    options: {}
                };
                $node.children().each(function(){
                    item.options[this.value] = $(this).text();
                });
                break;
                
            case 'textarea':
                item = {
                    type: 'textarea',
                    name: label || inputLabel(node),
                    disabled: !!$node.attr('disabled'),
                    value: $node.val()
                };
                break;
            
            case 'label':
                break;
            
            default:
                item = {type: 'html', html: $node.clone(true)};
                break;
        }
        
        if (item) {
            counter++;
            items['key' + counter] = item;
        }
    });
    
    return counter;
}

// convert html5 menu
$.contextMenu.fromMenu = function(element) {
    var $this = $(element),
        items = {};
        
    menuChildren(items, $this.children());
    
    return items;
};

// make defaults accessible
$.contextMenu.defaults = defaults;
$.contextMenu.types = types;
// export internal functions - undocumented, for hacking only!
$.contextMenu.handle = handle;
$.contextMenu.op = op;
$.contextMenu.menus = menus;

})(jQuery);


$.extend(UFinder, (function () {

    var _ufinderUI = {},
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {};

    return {
        registerUI: function (uiname, fn) {
            $.each(uiname.split(/\s+/), function (i, name) {
                _ufinderUI[name] = fn;
            });
        },
        _createContainer: function (id) {
            var $container = $('<div class="ufui-container"></div>');
            $(Utils.isString(id) ? '#' + id : id).append($container);
            return $container;
        },
        _createToolbar: function (uf) {
            var toolbars = uf.getOption('toolbars');

            var $toolbar = $.ufuitoolbar();


            uf.$container.append($toolbar);
            uf.$toolbar = $toolbar;

            if (toolbars && toolbars.length) {
                var btns = [];
                $.each(toolbars, function (i, uiNames) {
                    $.each(uiNames.split(/\s+/), function (index, name) {
                        if (name == '|') {
                            $.ufuiseparator && btns.push($.ufuiseparator());
                        } else {
                            if (_ufinderUI[name]) {
                                var ui = _ufinderUI[name].call(uf, name);
                                ui && btns.push(ui);
                            }
                        }

                    });
                    btns.length && $toolbar.ufui().appendToBtnmenu(btns);
                });
            }
            $toolbar.append($('<div class="ufui-dialog-container"></div>'));
        },
        _createSearchbox: function (uf) {
            var $searchbox = _ufinderUI['searchbox'].call(uf, 'list');
            uf.$toolbar.append($searchbox);
            uf.$searchbox = $searchbox;

        },
        _createtree: function (uf) {
            var $tree = _ufinderUI['tree'].call(uf, 'list');
            uf.$container.append($tree);
            uf.$tree = $tree;

        },
        _createlist: function (uf) {
            var $list = _ufinderUI['list'].call(uf, 'list');
            uf.$container.append($list);
            uf.$list = $list;
        },
        _createpreview: function (uf) {
            var $preview = _ufinderUI['preview'].call(uf, 'list');
            uf.$container.append($preview);
            uf.$preview = $preview;
        },
        _createclipboard: function (uf) {
            var $clipboard = _ufinderUI['clipboard'].call(uf, 'list');
            uf.$list.append($clipboard);
            uf.$clipboard = $clipboard;
        },
        _createContextmenu: function (uf) {
            /* 文件菜单 */
            $.contextMenu({
                selector: '.ufui-list-container .ufui-file',
                callback: function(key, options) {
                    uf.execCommand(options.items[key]['cmd']);
                },
                items: {
                    "edit": {name: uf.getLang('menu')['edit'], icon: "edit", cmd: 'edit'},
                    "cut": {name: uf.getLang('menu')['cut'], icon: "cut", cmd: 'cut'},
                    "copy": {name: uf.getLang('menu')['copy'], icon: "copy", cmd: 'copy'},
                    //"move": {name: uf.getLang('menu')['move'], icon: "move", cmd: 'move'},

                    "rename": {name: uf.getLang('menu')['rename'], icon: "rename", cmd: 'rename'},
                    "delete": {name: uf.getLang('menu')['remove'], icon: "remove", cmd: 'remove'}
                }
            });
            /* 容器菜单 */
            $.contextMenu({
                selector: '.ufui-list-container',
                callback: function(key, options) {
                    uf.execCommand(options.items[key]['cmd']);
                },
                items: {
                    "edit": {name: uf.getLang('menu')['pathparent'], icon: "pathparent", cmd: 'pathparent'},
                    "checkall": {name: uf.getLang('menu')['selectall'], icon: "selectall", cmd: 'selectall'},
                    "paste": {name: uf.getLang('menu')['paste'], icon: "paste", cmd: 'paste'},
                    "refresh": {name: uf.getLang('menu')['refresh'], icon: "refresh", cmd: 'refresh'},
                    "touch": {name: uf.getLang('menu')['touch'], icon: "touch", cmd: 'touch'},
                    "mkdir": {name: uf.getLang('menu')['mkdir'], icon: "mkdir", cmd: 'mkdir'}

                }
            });
        },
        _createMessageHolder: function (uf) {
            var $messageHolder = $('<div class="ufui-message-list"></div>');
            uf.$container.append($messageHolder);
            uf.$messageHolder = $messageHolder;

            var _messages = {};

            uf.on('showmessage', function (type, p) {
                var $message = _ufinderUI['message'].call(uf, 'message', {
                    icon: p.icon || 'warning',
                    title: p.title || '',
                    loadedPercent: p.loadedPercent || 100,
                    timeout: p.timeout,
                    id: p.id || 'm' + (+new Date()).toString(36)
                });
                if (p.id) {
                    _messages[p.id] = $message;
                }
                $messageHolder.append($message);
                $message.ufui().show();
            });
            uf.on('updatemessage', function (type, p) {
                var $message;
                if (p.id && ($message = _messages[p.id])) {
                    $message.ufui().setIcon(p.icon).setMessage(p.title).setTimer(p.timeout).setLoadedPercent(p.loadedPercent);
                }
            });
            uf.on('hidemessage', function (type, p) {
                var $message;
                if (($message = _messages[p.id])) {
                    $message.ufui().hide();
                }
            });
        },
        getUFinder: function (id, options) {
            var $container = this._createContainer(id),
                uf = this.getFinder($container, options);

            uf.$container = $container;
            uf.on('focus', function () {
                $container.removeClass('ufui-disabled');
            }).on('blur', function () {
                $container.addClass('ufui-disabled');
            });

            this._createToolbar(uf);
            this._createSearchbox(uf);
            this._createtree(uf);
            this._createlist(uf);
            this._createpreview(uf);
            this._createclipboard(uf);
            this._createMessageHolder(uf);
            this._createContextmenu(uf);

            uf._initDomEvent();
            uf.fire('ready');
            return uf;
        },
        delUFinder: function (id) {
        },
        registerWidget: function (name, pro, cb) {
            _widgetData[name] = $.extend2(pro, {
                $root: '',
                _preventDefault: false,
                root: function ($el) {
                    return this.$root || (this.$root = $el);
                },
                preventDefault: function () {
                    this._preventDefault = true;
                },
                clear: false
            });
            if (cb) {
                _widgetCallBack[name] = cb;
            }
        },
        getWidgetData: function (name) {
            return _widgetData[name];
        },
        setWidgetBody: function (name, $widget, finder) {
            if (!finder._widgetData) {
                Utils.extend(finder, {
                    _widgetData: {},
                    getWidgetData: function (name) {
                        return this._widgetData[name];
                    },
                    getWidgetCallback: function (widgetName) {
                        var me = this;
                        return function () {
                            return _widgetCallBack[widgetName].apply(me, [me, $widget].concat(Array.prototype.slice.call(arguments, 0)));
                        };
                    }
                });

            }
            var pro = _widgetData[name];
            if (!pro) {
                return null;
            }
            pro = finder._widgetData[name];
            if (!pro) {
                pro = _widgetData[name];
                pro = finder._widgetData[name] = $.type(pro) == 'function' ? pro : Utils.clone(pro);
            }

            pro.root($widget.ufui().getBodyContainer());

            pro.initContent(finder, $widget);
            if (!pro._preventDefault) {
                pro.initEvent(finder, $widget);
            }

            pro.width && $widget.width(pro.width);

        },
        createEditor: function (id, opt) {
        },
        createToolbar: function (options, editor) {
        }
    };
})());


UF.registerUI('open pathparent pathbackward pathforward touch mkdir rename remove toggleliststyle togglepreview',
    function (name) {
        var me = this;
        var $btn = $.ufuibutton({
            icon: name,
            click: function (evt) {
                me.execCommand(name);
                evt.preventDefault();
                return false;
            },
            title: me.getLang('labelMap')[name] || ''
        });

        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1);
        });
        return $btn;
    }
);

UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui(),
            $preCliskFile,
            singleClickTimer,
            singleClickTarget,
            addFile = function (filelist) {
                var currentPath = me.getCurrentPath();
                $.each($.isArray(filelist) ? filelist : [filelist], function (k, file) {
                    if (Utils.getParentPath(file.path) == currentPath) {
                        var type = Utils.getPathExt(file.path);
                        ufList.addItem({
                            type: file.type == 'dir' ? 'dir' : type,
                            title: file.name,
                            details: Utils.dateFormat(new Date(file.time * 1000), "yyyy-MM-dd hh:mm:ss"),
                            path: file.path,
                            pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr'),
                            link: me.proxy.getRequestUrl({
                                'cmd': 'download',
                                'target': file.path
                            })
                        });

                        if (Utils.isImagePath(file.path)) {
                            var realPath = me.getRealPath(file.path);
                            ufList.getItem(file.path).setPreviewImg(realPath);
                        }
                    }
                });
            },
            getPathsFormView = function () {
                var paths = [];
                $list.find('.ufui-file.ufui-active').each(function (i, item) {
                    paths.push($(item).attr('data-path'));
                });
                return paths;
            },
            updateSelection = function () {
                me.setSelectedFiles(getPathsFormView());
            },
            clearAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(false);
                });
            },
            checkAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(true);
                });
            },
            preview = function (target) {
                // TODO: 全局终止预览
                if (typeof(clearPreview) != "undefined") clearPreview();
                me.execCommand('preview', target);
            };

        /* 双击文件 */
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui(),
                path = ufFile.getPath();
            if (ufFile.getType() == 'dir') {
                var file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            } else {
                if (Utils.isImagePath(path)) {
                    me.execCommand('lookimage', path);
                } else if (Utils.isCodePath(path)) {
                    me.execCommand('lookcode', path);
                } else if (Utils.isWebPagePath(path)) {
                } else {
                    me.execCommand('download', path);
                }
            }
        });



        /* 双击文件名 */
        $list.delegate('.ufui-file-title', 'dblclick', function (e) {
            me.execCommand("rename");
            return false;
        });

        //$list.delegate('.ufui-file-title', 'click', function (e) {
        //    return;
        //});

        /* 拖动文件 */
        $list.delegate('.ufui-file', 'dragstart', function (e) {
            //ufList.setCurrentDrag(this);
            e.originalEvent.dataTransfer.setData("DownloadURL", $(e.target).attr("dataurl"));
        });

        /* 拖放文件, 接收 */
        var listcontainer = $list.find(".ufui-list-container");
        lcFileDragHover = function(e) {
            e.stopPropagation();
            e.preventDefault();
            e.type == "dragover" ? listcontainer.addClass("hover") : listcontainer.removeClass("hover");
        }
        //listcontainer[0].addEventListener("dragover", lcFileDragHover, false);
        //listcontainer[0].addEventListener("dragleave", lcFileDragHover, false);
        //listcontainer[0].addEventListener("drop", lcFileDragHover, false);

        /* 文件夹拖入事件 */
        $list.delegate('.ufui-file[filetype=dir]', 'dragenter', function (e) {
            // 剔除其他
            $(this).parent().find(".ufui-file").removeClass("ufui-file-open");
            // 选中当前
            $(this).addClass("ufui-file-open");
        });

        /* 文件夹文件进入事件 */
        $list.delegate('.ufui-file[filetype=dir]', 'drop', function (e) {
            var dist = $(this).attr("data-path");
            var moveHandler = function (data) {
                me.execCommand("refresh");
            };
            me.proxy.move([dist].concat(me.getSelection().getSelectedFiles()), moveHandler);
        });

        // 事件顺序 mousedown -> dragstart -> mouseup
        /* 点击选文件 */
        $list.delegate('.ufui-file', 'mousedown', function (e) {
            //$list.delegate('.ufui-file', 'click', function (e) {
            /* 解决双击单个文件时,不选中问题 */
            if (singleClickTimer && singleClickTarget == e.target && !(e.shiftKey || e.ctrlKey || e.metaKey)) {
                return;
            } else {
                singleClickTimer = setTimeout(function () {
                    singleClickTimer = 0;
                }, 500);
                singleClickTarget = e.target;
            }

            var $file = $(this);
            /* 点击选中文件 */
            var ufFile = $(this).ufui(),
                state = ufFile.active();

            if (e.shiftKey && $preCliskFile) {
                /* 按住shift,直点击文件 */
                var $start, $end, $current, endIndex;
                if ($file.index() > $preCliskFile.index()) {
                    $start = $preCliskFile;
                    $end = $file;
                } else {
                    $start = $file;
                    $end = $preCliskFile;
                }
                endIndex = $end.index();

                $current = $start;
                while ($current.length) {
                    $current.ufui().active(true);
                    $current = $current.next();
                    if ($current.index() > endIndex) break;
                }
                //updateSelection();
            } else if (e.ctrlKey || e.metaKey) {
                /* 按住ctrl,直点击文件 */
                ufFile.active(!state);

                !state && ($preCliskFile = $file);
                //updateSelection();
                // 按钮已激活, 则动作忽略
            } else if (state == false) {

                /* 直接点击文件 */
                if ((!state && getPathsFormView().length > 0) || (state && getPathsFormView().length > 1)) {
                    clearAllSelectedFiles($file);
                    ufFile.active(true);
                } else {
                    ufFile.active(!state);
                }

                ufFile.active() && ($preCliskFile = $file);
                /* 预览文件 */
                preview($file.attr('data-path'));
            }
            updateSelection();
        });

        /* 去除选区 */
        //$list.on('click', function (e) {
        //    var target = e.target || e.srcElement;
        //    if (target && target == $list.children()[0]) {
        //        //clearAllSelectedFiles();
        //        updateSelection();
        //    }
        //});
        /* 绘制选择框 */
        var origin, pos1, pos2;
        $list.on('mousedown', function (e) {
            var selectbox = $list.find(".ufui-select-box");
            // trigger event
            if (!e.originalEvent) return;
            if (e.type == "mousedown") {
                if (!$(e.originalEvent.srcElement).hasClass("ufui-list-container")) return;
                if (!(e.ctrlKey || e.shiftKey)) {
                    clearAllSelectedFiles();
                    updateSelection();
                }
                selectbox.show();
                origin = {x: e.offsetX - e.pageX, y: e.offsetY - e.pageY};
                pos1 = {x: e.pageX, y: e.pageY};
            }
        });

        $(document).on('mouseup mousemove', function (e) {
            var selectbox = $list.find(".ufui-select-box");
            if (e.type == "mousemove") {
                if (!origin) return;
                pos2 = {x: e.pageX, y: e.pageY};
                xs = pos1.x > pos2.x ? [pos2.x, pos1.x] : [pos1.x, pos2.x], ys = pos1.y > pos2.y ? [pos2.y, pos1.y] : [pos1.y, pos2.y];
                var left = xs[0], top = ys[0], width = xs[1] - xs[0], height = ys[1] - ys[0];
                selectbox.css({
                    top: top + origin.y,
                    left: left + origin.x,
                    width: width,
                    height: height
                });
                var overcount = 0;
                $list.find(".ufui-file").each(function (i, k) {
                    var ufFile = $(k).ufui();
                    var state = me.getSelection().getSelectedFiles().indexOf(ufFile.getPath()) != -1;
                    if (Utils.isOverlap($(k), selectbox)) {
                        overcount++;
                        state = !state;
                    }
                    ufFile.active(state);
                });
            } else {
                updateSelection();
                selectbox.css({width: 0, height: 0, left: -2000, top: -2000});
                selectbox.hide();
                origin = null;
            }
        });

        /* 快速检索快捷键 */
        me.on("searchindex", function (e) {
            me.$toolbar.find(".searchbox input").focus();
        });

        /* 全选 selectall */
        //me.on('checkall', function (e) {
        //    checkAllSelectedFiles();
        //    updateSelection();
        //});

        /* 目录改变 */
        me.on('currentPathChange', function (type, path) {
            if ($list.attr('data-path') != path) {
                $list.attr('data-path', path);
                ufList.clearItems();
                addFile(me.dataTree.listDirFileInfo(path));
            }
        });


        /* 新增文件 */
        me.on('addFiles', function (type, files) {
            addFile(files);
        });

        /* 重命名文件 */
        me.on('updateFile', function (type, path, info) {
            ufList.isItemInList(path) && ufList.removeItem(path);
            addFile(info);
        });

        /* 删除文件 */
        me.on('removeFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                // 刷新时动画效果不好
                ufList.isItemInList(path) && ufList.removeItem(path, 0);
                ufList.isItemInList(path) && ufList.removeItem(path, 0);
            });
        });

        /* 选中文件 */
        me.on('selectFiles', function (type, paths) {
            clearAllSelectedFiles();
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                if (ufFile) {
                    if (!$.isArray(paths)) {
                        // 单个文件模拟点击事件, mousedown 自带激活
                        ufFile.trigger("mousedown");
                    } else {
                        ufFile.active(true);
                    }
                    /* 滚动到选中文件 */
//                    var $c = $list.find('.ufui-list-container').scrollTop(ufFile.root().offset().top - 3);
                }
            });
            updateSelection();
        });

        /* 锁文件 */
        me.on('lockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(true);
            });
        });


        /* 解锁文件 */
        me.on('unlockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(false);
            });
        });

        /* 文件进入重命名 */
        me.on('renameFileTitle', function (type, path, callback) {
            var ufFile = ufList.getItem(path);
            if (ufFile) {
                ufFile.editabled(true, function (name) {
                    callback(name, function (isSuccess) {
                        /* 重命名失败 */
                        if (!isSuccess) {
                            var file = me.dataTree.getFileInfo(path);
                            if (file) {
                                ufFile.setTitle(file.name);
                            }
                        }
                    });
                });
            }
        });

        /* 进入新建文件 */
        me.on('newFileTitle', function (type, filetype, callback) {
            var tmpName = filetype == 'dir' ? '新建文件夹' : '新建文件',
                tmpPath = me.getCurrentPath() + tmpName,
                tmpUfFile;
            addFile({
                type: filetype,
                path: tmpPath,
                name: tmpName,
                read: true,
                write: true
            });
            tmpUfFile = ufList.getItem(tmpPath);
            tmpUfFile.editabled(true, function (name) {
                callback(name, function (isSuccess) {
                    ufList.removeItem(tmpPath);
                });
            });
        });

        return $list;
    }
);

UF.registerUI('message',
    function (name, options) {
        var me = this,
            $message = $.ufuimessage(options),
            request = options.request;

        if (request) {
            $message.find('.ufui-message-loadbar').on('click', function () {
                request.pause();
            });
        }
        return $message;
    }
);


UF.registerUI('tree',
    function (name) {
        var me = this,
            $tree = $.ufuitree(),
            ufTree = $tree.ufui(),
            addItem = function (info) {
                if (info.type == 'dir') {
                    if (!ufTree.isItemInTree(info.path)) {
                        ufTree.addItem({
                            type: info.type,
                            title: info.name,
                            path: info.path
                        });
                    }
                }
            },
            openDir = function (path) {
                var info = me.dataTree.getFileInfo(path);
                if (info.read && !me.dataTree.isFileLocked(path)) {
                    me.execCommand('open', path);
                }
            };

        /* 点击目录执行打开命令 */
        $tree.delegate('.ufui-leaf-expand,.ufui-leaf-folder,.ufui-leaf-title', 'click', function () {
            var $target = $(this),
                $detail = $target.parent(),
                $leaf = $detail.parent(),
                path = $leaf.attr('data-path'),
                info = me.dataTree.getFileInfo(path);
            if (info.read && !me.dataTree.isFileLocked(path)) {
                if ($target.hasClass('ufui-leaf-expand')) {
                    if (!$detail.hasClass('ufui-leaf-detail-closed')) {
                        me.execCommand('list', path);
                    }
                } else {
                    me.execCommand('open', path);
                }
            }
        });

        /* 初始化根节点 */
        me.on('dataReady', function (type, info) {
            ufTree.setRoot({
                type: info.type,
                title: 'Root',
                path: info.path
            });
        });

        /* 打开目录 */
        me.on('listFile', function (type, filelist) {
            $.each(filelist, function (i, file) {
                addItem(file);
            });
        });

        /* 打开目录 */
        me.on('addfiles', function (type, files) {
            $.each($.isArray(files) ? files : [files], function (k, file) {
                addItem(file);
            });
        });

        /* 重命名文件 */
        me.on('renamefile', function (type, path, file) {
            if (file.type != 'dir') return;
            var ufLeaf = ufTree.getItem(path);
            if (ufLeaf) {
                ufTree.removeItem(path);
                addItem(file);
            }
        });

        /* 删除文件 */
        me.on('removefiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufTree.isItemInTree(path) && ufTree.removeItem(path);
            });
        });

        return $tree;
    }
);

UF.registerUI('upload',
    function (name) {
        var me = this,
            id = 'ufui-btn-upload-' + (+new Date()).toString(36),
            $btn = $.ufuibutton({
                icon: name,
                click: function () {

                },
                title: me.getLang('labelMap')[name] || ''
            });

        /* 按钮状态反射 */
        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1);
            if (me.webuploader) {
                state == -1 ? me.webuploader.disable() : me.webuploader.enable();
            }
        });

        $btn.attr('id', id);
        /* 绑定按钮到uploader */
        me.on('initUploader', function () {
            me.webuploader.addButton({
                id: '#' + id
            });
        });
        return $btn;
    }
);

UF.registerUI('lookimage lookcode', function (name) {

    var me = this, $dialog,
        labelMap = me.getOption('labelMap'),
        opt = {
            title: (labelMap && labelMap[name]) || me.getLang("labelMap." + name),
            url: me.getOption('URL') + '/dialogs/' + name + '/' + name + '.js'
        };

    var $btn = $.ufuibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });

    /* 加载dialog模版数据 */
    Utils.loadFile(document, {
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    }, function () {
        /* 调整数据 */
        var data = UF.getWidgetData(name);
        if (data.buttons) {
            var ok = data.buttons.ok;
            if (ok) {
                opt.oklabel = ok.label || me.getLang('ok');
                if (ok.exec) {
                    opt.okFn = function () {
                        return $.proxy(ok.exec, null, me, $dialog)();
                    };
                }
            }
            var cancel = data.buttons.cancel;
            if (cancel) {
                opt.cancellabel = cancel.label || me.getLang('cancel');
                if (cancel.exec) {
                    opt.cancelFn = function () {
                        return $.proxy(cancel.exec, null, me, $dialog)();
                    };
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.ufuimodal(opt);

        $dialog.attr('id', 'ufui-dialog-' + name).addClass('ufui-dialog-' + name)
            .find('.ufui-modal-body').addClass('ufui-dialog-' + name + '-body');

        $dialog.ufui().on('beforehide', function () {

        }).on('beforeshow', function () {
            var $root = this.root(),
                win = null,
                offset = null;
            if (!$root.parent()[0]) {
                me.$container.find('.ufui-dialog-container').append($root);
            }

            /* IE6下 特殊处理, 通过计算进行定位 */
            if ($.IE6) {

                win = {
                    width: $(window).width(),
                    height: $(window).height()
                };
                offset = $root.parents(".ufui-toolbar")[0].getBoundingClientRect();
                $root.css({
                    position: 'absolute',
                    margin: 0,
                    left: ( win.width - $root.width() ) / 2 - offset.left,
                    top: 100 - offset.top
                });

            }
            UF.setWidgetBody(name, $dialog, me);
        }).on('afterbackdrop', function () {
            this.$backdrop.css('zIndex', me.getOption('zIndex') + 1).appendTo(me.$container.find('.ufui-dialog-container'));
            $dialog.css('zIndex', me.getOption('zIndex') + 2);
        }).on('beforeok', function () {

        }).attachTo($btn);
    });

    me.on('selectionchange ready focus blur currentpathchange', function () {
        var state = me.queryCommandState(name);
        $btn.ufui().disabled(state == -1).active(state == 1);
    });
    return $btn;
});


/**
 * 预览窗口
 */
UF.registerUI('preview',

    function (name) {
        var me = this,
            $preview = $.ufuipreview();
        return $preview;

    }
    // 事件暂时未定义
);

/**
 * 搜索框
 */
UF.registerUI('searchbox',
    function (name) {
        var me = this,
        $searchbox = $.ufuisearchbox({"placeholder": me.getLang('hint')['search']});
        //ufSearchbox = $searchbox.ufui();
        var sdiv = $searchbox;
        sbox = sdiv.find("input");
        sres = sdiv.find("ul");
        sbox.on('input', function (e) {
            var key = $(e.target).val();
            sres.empty();
            if (key.length > 0)
                me.execCommand('search', key);
            return;
        });
        sbox.on('keydown', function (e) {
            if (e.keyCode == 27) {// esc
                sbox.blur();
            } else if (e.keyCode == 38) {// up arrow
                var next = sres.find("li.focus").prev();
                if (next.length == 0) next = sres.children().last();
                sres.find("li.focus").removeClass("focus");
                next.addClass("focus");
            } else if (e.keyCode == 40) {// down arrow
                var next = sres.find("li.focus").next();
                if (next.length == 0) next = sres.children().first();
                sres.find("li.focus").removeClass("focus");
                next.addClass("focus");
            } else if (e.keyCode == 13) {// enter
                // 默认选择第一个
                sfocus = sres.find("li.focus");
                if (sfocus.length == 0) sfocus = sres.children().first();
                sfocus.trigger("mousedown");
            }
            return;
        });
        sbox.on('focus blur', function (e) {
            if (e.type == "focus") sbox.select();
            sdiv.toggleClass("blur", e.type == 'blur');
            return;
        });
        // mousedown -> input blur -> mouseup -> finish click
        $searchbox.delegate(".search-ul li", "mousedown", function (e) {
            var p = e.target.tagName == "LI" ? $(e.target) : $(e.target).parents("li");
            var dir = p.attr("data-path");
            var file = p.attr("filename");
            me.execCommand("open", dir);
            setTimeout(function () {
                me.execCommand("selectfile", dir + file);
                me.setFocus();
            }, 500);
        });
        return $searchbox;
    }
);

/**
 * 剪切板
 */
UF.registerUI('clipboard',

    function (name) {
        var me = this,
        //filecache = [],
            $clipboard = $.ufuiclipboard(),
            ufClipboard = $clipboard.ufui(),
            me = this;

        $clipboard.delegate(".clipboard-clear", "click", function (e) {
            ufClipboard.clear();
        });

        me.on("copy", function (type) {
            ufClipboard.setIsCopy(true);
            ufClipboard.addFiles(me.getSelection().getSelectedFiles());
        });

        me.on("cut", function (type) {
            ufClipboard.setIsCopy(false);
            ufClipboard.addFiles(me.getSelection().getSelectedFiles());
        });

        me.on("paste", function (type) {
            var moveHandler = function (data) {
                me.execCommand("refresh");
                ufClipboard.clear();
            };
            if (ufClipboard.getIsCopy()) {
                me.proxy.copy(ufClipboard.getPasteTarget(me.getCurrentPath()), moveHandler);
            } else {
                me.proxy.move(ufClipboard.getPasteTarget(me.getCurrentPath()), moveHandler);
            }

            //ufClipboard.paste(uf.getCurrentPath());
        });

        me.on("clear", function (type) {
            ufClipboard.clear();
            //filecache.splice(0, filecache.length);
        });
        return $clipboard;

    }
);


})(jQuery, window);
