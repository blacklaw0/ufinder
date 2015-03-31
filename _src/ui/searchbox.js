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
