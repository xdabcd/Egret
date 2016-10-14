/**
 *
 * @author
 *
 */
var SortUtils = (function () {
    function SortUtils() {
    }
    var d = __define,c=SortUtils,p=c.prototype;
    SortUtils.sortNum = function (a, b) {
        return a - b;
    };
    SortUtils.random = function (a, b) {
        return Math.random() - 0.5;
    };
    return SortUtils;
}());
egret.registerClass(SortUtils,'SortUtils');
//# sourceMappingURL=SortUtils.js.map