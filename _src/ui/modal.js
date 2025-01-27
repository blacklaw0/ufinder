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
