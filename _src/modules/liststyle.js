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