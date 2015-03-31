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