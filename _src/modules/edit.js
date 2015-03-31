UF.registerModule("editmodule", function () {
    var uf = this;
    return {
        "defaultOptions": {},
        "commands": {
            "copy": {
                execute: function (path) {
                    uf.fire("copy", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "cut": {
                execute: function (path) {
                    uf.fire("cut", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "paste": {
                execute: function (path) {
                    uf.fire("paste", path);
                },
                queryState: function () {
                    return 0;
                }
            },
            "clear": {
                execute: function () {
                    uf.fire("clear");
                },
                queryState: function () {
                    return 0;
                }
            },
            "checkall": {
                execute: function () {
                    uf.fire("checkall");
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "copy": "ctrl+67",// ctrl + v
            "cut": "ctrl+88",// ctrl + x
            "paste": "ctrl+86",// ctrl + c
            //"checkall": "ctrl+65",// ctrl + a
            "clear": '27'// esc
        },
        "events": {}
    };
});
