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