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