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
