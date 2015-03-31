UF.registerModule("searchmodule", function () {
    var uf = this;
    var searchHandler = function (res) {
        // TODO: namespace stain?
        var results = res.data['results'];
        var sul = uf.$toolbar.find(".search-ul");
        var RECORD_MAX = 10;
        for (var i in results.slice(0, RECORD_MAX)) {
            var dir = results[i].substr(0, results[i].lastIndexOf('/') + 1);
            var file = results[i].substr(results[i].lastIndexOf('/') + 1);
            //sul.append($("<li data-path='" + dir + "' filename='" + file + "' >"
            //    +  + "</li>"));

            var tmpl = "<li data-path='<%=dir%>' filename='<%=file%>'><div class='title'><%=title%></div><div class='path'><%=dir%></div></li>";
            var options = {
                title: results[i].substr(results[i].lastIndexOf('/') + 1),
                dir: dir,
                file: file
            };
            sul.append($.parseTmpl(tmpl, options));
        }
        //uf.$preview.find(".display").html(content);
    };
    return {
        "commands": {
            "search": {
                execute: function (path) {
                    uf.proxy.search(path, searchHandler);
                },
                queryState: function () {
                    return 0;
                }
            },
            "searchindex": {
                execute: function (path) {
                    uf.fire("searchindex");
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "searchindex": "ctrl+70" // ctrl + f 检索
        }
    };
});
