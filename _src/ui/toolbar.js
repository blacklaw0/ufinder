//toolbar 类
(function () {
    UF.ui.define('toolbar', {
        //unselectable="on" onmousedown="return false"
        tpl: '<div class="ufui-toolbar"  ><div class="ufui-btn-toolbar"><div class="searchbox blur" >' +
        '<div class="ufui-icon-search"/><input style="float:right;" placeholder="<%=placeholder%>" type="text"/><ul class="search-ul"></ul></div></div></div>',
        init: function (options) {
            var me = this;
            var item = $($.parseTmpl(me.tpl, {"placeholder":options['placeholder']}));
            var $root = this.root(item);
            var sdiv = $root.find(".searchbox");
            var sbox = sdiv.find("input");
            sres = sdiv.find("ul");
            sbox.on('input', function (e) {
                var key = $(e.target).val();
                sres.empty();
                // TODO: namespace stain
                if (key.length > 0)

                    uf.execCommand('search', key);
                return;
            });
            sbox.on('keydown', function (e) {
                // TODO code trick
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
                    var sfocus = sres.find("li.focus");
                    if (sfocus.length == 0) sfocus = sres.children().first();
                    sfocus.trigger("mousedown");
                }
                return;
            });
            //var lasttimestamp = 0;
            sbox.on('focus blur', function (e) {
                //console.log(e.timeStamp - lasttimestamp);
                //if (!(e.type == "blur" && (e.timeStamp - lasttimestamp) < 100)) {
                if (e.type == "focus") sbox.select();
                sdiv.toggleClass("blur", e.type == 'blur');
                //}
                //lasttimestamp = e.timeStamp;
                return;
            });
            //sdiv.append(sbox);
            //sdiv.append(sres);
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
