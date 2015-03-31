/**
 * Created by Administrator on 2015/3/26 0026.
 */
/**
 * 测试
 * @returns {{a: Function, _a: Function}}
 */
function circle() {
    return {

        /**
         * 创建 DataTree 实例
         * @constructor
         * @param { UF.Finder } finder - 绑定的 finder 实例
         */

        /**
         *
         * @param finder
         */
        constructor: function (finder) {
            this.finder = finder;
            this.root = null;
        },
        a:function(){alert("a");},
        _a:function(){alert("b");}
    };



}