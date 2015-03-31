UF.extendClass(Finder, {
    _getCommand: function (name) {
        return this._commands[name.toLowerCase()];
    },
    _queryCommand: function (name, type, args) {
        var cmd = this._getCommand(name);
        if (cmd) {
            var queryCmd = cmd['query' + type];
            if (queryCmd)
                return queryCmd.apply(cmd, [this].concat(args));
        }
        return 0;
    },
    queryCommandState: function (name) {
        if (!this.isFocused) return -1;
        return this._queryCommand(name, "State", Utils.argsToArray(1));
    },
    queryCommandValue: function (name) {
        return this._queryCommand(name, "Value", Utils.argsToArray(1));
    },
    execCommand: function (name) {
        name = name.toLowerCase();

        var cmdArgs = $.makeArray(arguments).slice(1),
            cmd, result;

        var me = this;
        cmd = this._getCommand(name);

        if (!cmd) {
            return false;
        }

        me.fire('beforeexeccommand', name);
        result = cmd.execute.apply(me, cmdArgs);
        me.fire('afterexeccommand', name);
        //if (name == "search") aa;

        return result === undefined ? null : result;
    }
});
