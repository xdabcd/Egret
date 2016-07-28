/**
 *
 * @author
 *
 */
var UtilsManager = (function () {
    function UtilsManager() {
    }
    var d = __define,c=UtilsManager,p=c.prototype;
    UtilsManager.init = function () {
        AnchorUtils.init();
        KeyboardUtils.init();
    };
    return UtilsManager;
}());
egret.registerClass(UtilsManager,'UtilsManager');
