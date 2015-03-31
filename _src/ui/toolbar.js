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
