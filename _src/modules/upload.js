UF.registerModule("uploadmodule", function () {
    var uf = this,
        initWebUploader = function () {

            var timestrap = (+new Date()).toString(36),
                messageId = 'u' + timestrap;

            // 创建webupoaler实例
            var uploader = uf.webuploader = WebUploader.create({
                dnd: '.ufui-list-container',
                // swf文件路径
                swf: uf.getOption('uploaderSwfUrl'),

                // 文件接收服务端。
                server: uf.getOption('serverUrl') + '?cmd=upload&target=' + uf.getCurrentPath(),

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                // pick: '#' + id,

                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,

                threads: 1,
                fileVal: uf.getOption('uploaderFileName'),
                formdata: {},
                duplicate: false

            });

            // 当有文件被添加进队列的时候
            uploader.on('fileQueued', function (file) {

                uf.execCommand('upload', file);
            });

            uf.fire('initUploader');

        };


    return {
        "init": function () {

        },
        "defaultOptions": {
            'uploaderFileName': 'file',
            'uploaderSwfUrl': uf.getOption('URL') + '/lib/webuploader/Uploader.swf',
            'uploaderJsUrl': uf.getOption('URL') + '/lib/webuploader/webuploader.js'
        },
        "commands": {
            "upload": {
                execute: function (file) {
                    if (file) {
                        aafile = file;
                        uf.proxy.upload(uf.getCurrentPath(), file, function (d) {
                            if (d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('selectfiles', file.path);
                            } else {
                                uf.fire('showmessage', {title: d.message, timeout: 3000});
                            }
                        });
                    }
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "events": {
            'ready': function () {
                var doc = uf.$container[0].ownerDocument;
                Utils.loadFile(doc, {
                    src: uf.getOption('uploaderJsUrl'),
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }, initWebUploader);
            },
            'currentpathchange': function (type, path) {
                uf.webuploader && uf.webuploader.option('server', uf.getOption('serverUrl') + '?cmd=upload&target=' + path);
            }
        }
    };
});
