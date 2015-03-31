UF.registerModule("openmodule", function () {
    var uf = this,
        listFile = function (path, isOpen) {

            if (path === undefined) {
                path = uf.getSelection().getSelectedFile();
            } else if (path == "") {
                path = "/";
            }
            var lastnearest = "";
            // 避免非法path造成的死循环
            var data = uf.dataTree.listDirFileInfo(path),
                openHandler = function (data) {
                    var filelist = (data && data.data && data.data.files) || [];
                    uf.dataTree.addFiles(filelist);
                    var nearest = uf.dataTree.getNearestNode(path);
                    // 一直递归到目的路径
                    if (lastnearest != nearest) {
                        lastnearest = nearest;
                        uf.proxy.ls(nearest, openHandler);
                    } else {
                        isOpen && uf.setCurrentPath(path);
                    }

                };
            // 启用缓存数据
            if (data && data.length) {
                openHandler(data);
            } else {
                // 远程数据
                var lastnearest = uf.dataTree.getNearestNode(path);
                uf.proxy.ls(lastnearest, openHandler);
            }

        },
        queryState = function () {
            var paths, info;
            paths = uf.getSelection().getSelectedFiles();
            if (paths.length == 1) {
                info = uf.dataTree.getFileInfo(paths[0]);
                return info && info.read && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
            } else {
                return -1;
            }
        };

    return {
        "init": function () {

        },
        "defaultOptions": {},
        "commands": {
            "open": {
                execute: function (path) {
                    if (path === undefined) {
                        path = uf.getSelection().getSelectedFile();
                    } else if (path == "") {
                        path = "/";
                    }

                    uf.setSelectedFiles([]);// 避免查询空节点的状态
                    uf.dataTree.removeDirChilds(path),// 清空tree缓存, 强制刷新
                        listFile(path, true);
                },
                queryState: queryState
            },
            "refresh": {
                execute: function () {
                    var uf = this, path = uf.getCurrentPath();
                    // 清空tree缓存
                    uf.dataTree.removeDirChilds(path),
                        listFile(path, true);
                },
                queryState: function () {
                    return 0
                }
            },
            "list": {
                execute: function (path) {
                    listFile(path, false);
                },
                queryState: queryState
            }
        },
        "shortcutKeys": {
            "open": "13",//enter
            "refresh": "116" //f5
        },
        "events": {}
    };
});
