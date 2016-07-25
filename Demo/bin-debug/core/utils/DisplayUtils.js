/**
 * Created by yangsong on 2014/11/24.
 * 显示对象工具类
 */
var DisplayUtils = (function (_super) {
    __extends(DisplayUtils, _super);
    /**
     * 构造函数
     */
    function DisplayUtils() {
        _super.call(this);
    }
    var d = __define,c=DisplayUtils,p=c.prototype;
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    p.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一张Gui的图片
     * @param resName
     * @returns {egret.Bitmap}
     */
    p.createEuiImage = function (resName) {
        var result = new eui.Image();
        var texture = RES.getRes(resName);
        result.source = texture;
        return result;
    };
    /**
     * 从父级移除child
     * @param child
     */
    p.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    return DisplayUtils;
}(BaseClass));
egret.registerClass(DisplayUtils,'DisplayUtils');
