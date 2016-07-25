/**
 * Created by egret on 15-8-7.
 */
var ArrayUtils = (function (_super) {
    __extends(ArrayUtils, _super);
    function ArrayUtils() {
        _super.apply(this, arguments);
    }
    var d = __define,c=ArrayUtils,p=c.prototype;
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    p.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    return ArrayUtils;
}(BaseClass));
egret.registerClass(ArrayUtils,'ArrayUtils');
