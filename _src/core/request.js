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
