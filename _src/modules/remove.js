UF.registerModule("removemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {},
        "commands": {
            "remove": {
                execute: function () {
                    if (!confirm(uf.getLang('warning')['removebefore'])) return;
                    var paths = uf.getSelection().getSelectedFiles();
                    if (paths.length) {
                        uf.dataTree.lockFiles(paths);
                        var req = uf.proxy.rm(paths, function (d) {
                            if (d.state == 0) {
                                uf.dataTree.removeFiles(paths);
                                uf.fire('removefiles', paths);
                            } else {
                                uf.fire('updatemessage', {title: d.message, timeout: 3000, id: req.id});
                            }
                            uf.dataTree.unLockFiles(paths);
                        });
                    }
                },
                queryState: function () {
                    var paths = uf.getSelection().getSelectedFiles();

                    if (paths.length > 0) {
                        for (var k in paths) {
                            var info = uf.dataTree.getFileInfo(paths[k]);
                            if (info && !(info.write && !uf.dataTree.isFileLocked(paths[k]))) {
                                return -1;
                            }
                        }
                        return 0;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "remove": "46" //remove Delete
        },
        "events": {}
    };
});
