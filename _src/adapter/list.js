UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui(),
            $preCliskFile,
            singleClickTimer,
            singleClickTarget,
            addFile = function (filelist) {
                var currentPath = me.getCurrentPath();
                $.each($.isArray(filelist) ? filelist : [filelist], function (k, file) {
                    if (Utils.getParentPath(file.path) == currentPath) {
                        var type = Utils.getPathExt(file.path);
                        ufList.addItem({
                            type: file.type == 'dir' ? 'dir' : type,
                            title: file.name,
                            details: Utils.dateFormat(new Date(file.time * 1000), "yyyy-MM-dd hh:mm:ss"),
                            path: file.path,
                            pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                        });

                        if (Utils.isImagePath(file.path)) {
                            var realPath = me.getRealPath(file.path);
                            ufList.getItem(file.path).setPreviewImg(realPath);
                        }
                    }
                });
            },
            getPathsFormView = function () {
                var paths = [];
                $list.find('.ufui-file.ufui-active').each(function (i, item) {
                    paths.push($(item).attr('data-path'));
                });
                return paths;
            },
            updateSelection = function () {
                me.setSelectedFiles(getPathsFormView());
            },
            clearAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(false);
                });
            },
            checkAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(true);
                });
            },
            preview = function (target) {
                // TODO: 全局终止预览
                if (typeof(clearPreview) != "undefined") clearPreview();
                me.$preview.find("b").html(target);
                uf.execCommand('preview', target);
            }
            ;

        /* 双击文件 */
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui(),
                path = ufFile.getPath();
            if (ufFile.getType() == 'dir') {
                var file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            } else {
                if (Utils.isImagePath(path)) {
                    me.execCommand('lookimage', path);
                } else if (Utils.isCodePath(path)) {
                    me.execCommand('lookcode', path);
                } else if (Utils.isWebPagePath(path)) {
                } else {
                    me.execCommand('download', path);
                }
            }
        });

        /* 双击文件名 */
        $list.delegate('.ufui-file-title', 'dblclick', function (e) {
            me.execCommand("rename");
            return false;
        });

        //$list.delegate('.ufui-file-title', 'click', function (e) {
        //    return;
        //});

        /* 拖动文件 */
        $list.delegate('.ufui-file', 'dragstart', function (e) {
            //ufList.setCurrentDrag(this);
            e.originalEvent.dataTransfer.setData("DownloadURL", $(e.target).attr("dataurl"));
        });

        // 事件顺序 mousedown -> dragstart -> mouseup
        /* 点击选文件 */
        $list.delegate('.ufui-file', 'mousedown', function (e) {
            //$list.delegate('.ufui-file', 'click', function (e) {
            /* 解决双击单个文件时,不选中问题 */
            if (singleClickTimer && singleClickTarget == e.target && !(e.shiftKey || e.ctrlKey || e.metaKey)) {
                return;
            } else {
                singleClickTimer = setTimeout(function () {
                    singleClickTimer = 0;
                }, 500);
                singleClickTarget = e.target;
            }

            var $file = $(this);
            /* 点击选中文件 */
            var ufFile = $(this).ufui(),
                state = ufFile.active();

            if (e.shiftKey && $preCliskFile) {
                /* 按住shift,直点击文件 */
                var $start, $end, $current, endIndex;
                if ($file.index() > $preCliskFile.index()) {
                    $start = $preCliskFile;
                    $end = $file;
                } else {
                    $start = $file;
                    $end = $preCliskFile;
                }
                endIndex = $end.index();

                $current = $start;
                while ($current.length) {
                    $current.ufui().active(true);
                    $current = $current.next();
                    if ($current.index() > endIndex) break;
                }
                //updateSelection();
            } else if (e.ctrlKey || e.metaKey) {
                /* 按住ctrl,直点击文件 */
                ufFile.active(!state);

                !state && ($preCliskFile = $file);
                //updateSelection();
                // 按钮已激活, 则动作忽略
            } else if (state == false) {

                /* 直接点击文件 */
                if ((!state && getPathsFormView().length > 0) || (state && getPathsFormView().length > 1)) {
                    clearAllSelectedFiles($file);
                    ufFile.active(true);
                } else {
                    ufFile.active(!state);
                }

                ufFile.active() && ($preCliskFile = $file);
                /* 预览文件 */
                preview($file.attr('data-path'));
            }
            updateSelection();
        });

        /* 去除选区 */
        //$list.on('click', function (e) {
        //    var target = e.target || e.srcElement;
        //    if (target && target == $list.children()[0]) {
        //        //clearAllSelectedFiles();
        //        updateSelection();
        //    }
        //});
        /* 绘制选择框 */
        var origin, pos1, pos2;
        $list.on('mousedown', function (e) {
            var selectbox = $list.find(".ufui-select-box");
            // trigger event
            if (!e.originalEvent) return;
            if (e.type == "mousedown") {
                if (!$(e.originalEvent.srcElement).hasClass("ufui-list-container")) return;
                if (!(e.ctrlKey || e.shiftKey)) {
                    clearAllSelectedFiles();
                    updateSelection();
                }
                selectbox.show();
                origin = {x: e.offsetX - e.pageX, y: e.offsetY - e.pageY};
                pos1 = {x: e.pageX, y: e.pageY};
            }
        });

        $(document).on('mouseup mousemove', function (e) {
            var selectbox = $list.find(".ufui-select-box");
            if (e.type == "mousemove") {
                if (!origin) return;
                pos2 = {x: e.pageX, y: e.pageY};
                xs = pos1.x > pos2.x ? [pos2.x, pos1.x] : [pos1.x, pos2.x], ys = pos1.y > pos2.y ? [pos2.y, pos1.y] : [pos1.y, pos2.y];
                var left = xs[0], top = ys[0], width = xs[1] - xs[0], height = ys[1] - ys[0];
                selectbox.css({
                    top: top + origin.y,
                    left: left + origin.x,
                    width: width,
                    height: height
                });
                var overcount = 0;
                $list.find(".ufui-file").each(function (i, k) {
                    var ufFile = $(k).ufui();
                    var state = me.getSelection().getSelectedFiles().indexOf(ufFile.getPath()) != -1;
                    if (Utils.isOverlap($(k), selectbox)) {
                        overcount++;
                        state = !state;
                    }
                    ufFile.active(state);
                });
            } else {
                updateSelection();
                selectbox.css({width: 0, height: 0, left: -2000, top: -2000});
                selectbox.hide();
                origin = null;
            }
        });

        /* 快速检索快捷键 */
        me.on("searchindex", function (e) {
            me.$toolbar.find(".searchbox input").focus();
        });

        /* 全选 selectall */
        //me.on('checkall', function (e) {
        //    checkAllSelectedFiles();
        //    updateSelection();
        //});

        /* 目录改变 */
        me.on('currentPathChange', function (type, path) {
            if ($list.attr('data-path') != path) {
                $list.attr('data-path', path);
                ufList.clearItems();
                addFile(me.dataTree.listDirFileInfo(path));
            }
        });


        /* 新增文件 */
        me.on('addFiles', function (type, files) {
            addFile(files);
        });

        /* 重命名文件 */
        me.on('updateFile', function (type, path, info) {
            ufList.isItemInList(path) && ufList.removeItem(path);
            addFile(info);
        });

        /* 删除文件 */
        me.on('removeFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                // 刷新时动画效果不好
                ufList.isItemInList(path) && ufList.removeItem(path, 0);
                ufList.isItemInList(path) && ufList.removeItem(path, 0);
            });
        });

        /* 选中文件 */
        me.on('selectFiles', function (type, paths) {
            clearAllSelectedFiles();
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                if (ufFile) {
                    if (!$.isArray(paths)) {
                        // 单个文件模拟点击事件, mousedown 自带激活
                        ufFile.trigger("mousedown");
                    } else {
                        ufFile.active(true);
                    }
                    /* 滚动到选中文件 */
//                    var $c = $list.find('.ufui-list-container').scrollTop(ufFile.root().offset().top - 3);
                }
            });
            updateSelection();
        });

        /* 锁文件 */
        me.on('lockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(true);
            });
        });


        /* 解锁文件 */
        me.on('unlockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(false);
            });
        });

        /* 文件进入重命名 */
        me.on('renameFileTitle', function (type, path, callback) {
            var ufFile = ufList.getItem(path);
            if (ufFile) {
                ufFile.editabled(true, function (name) {
                    callback(name, function (isSuccess) {
                        /* 重命名失败 */
                        if (!isSuccess) {
                            var file = me.dataTree.getFileInfo(path);
                            if (file) {
                                ufFile.setTitle(file.name);
                            }
                        }
                    });
                });
            }
        });

        /* 进入新建文件 */
        me.on('newFileTitle', function (type, filetype, callback) {
            var tmpName = filetype == 'dir' ? '新建文件夹' : '新建文件',
                tmpPath = me.getCurrentPath() + tmpName,
                tmpUfFile;
            addFile({
                type: filetype,
                path: tmpPath,
                name: tmpName,
                read: true,
                write: true
            });
            tmpUfFile = ufList.getItem(tmpPath);
            tmpUfFile.editabled(true, function (name) {
                callback(name, function (isSuccess) {
                    ufList.removeItem(tmpPath);
                });
            });
        });

        return $list;
    }
);