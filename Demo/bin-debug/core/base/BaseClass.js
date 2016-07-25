/**
 * Created by yangsong on 14/12/18.
 * 基类
 */
var BaseClass = (function () {
    function BaseClass() {
    }
    var d = __define,c=BaseClass,p=c.prototype;
    /**
     * 获取一个单例
     * @returns {any}
     */
    BaseClass.getInstance = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var Class = this;
        if (!Class._instance) {
            var argsLen = args.length;
            if (argsLen == 0) {
                Class._instance = new Class();
            }
            else if (argsLen == 1) {
                Class._instance = new Class(args[0]);
            }
            else if (argsLen == 2) {
                Class._instance = new Class(args[0], args[1]);
            }
            else if (argsLen == 3) {
                Class._instance = new Class(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                Class._instance = new Class(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                Class._instance = new Class(args[0], args[1], args[2], args[3], args[4]);
            }
        }
        return Class._instance;
    };
    return BaseClass;
}());
egret.registerClass(BaseClass,'BaseClass');
