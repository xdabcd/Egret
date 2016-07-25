/**
 * Created by yangsong on 15-1-23.
 * 引擎扩展类
 */
var EgretExpandUtils = (function (_super) {
    __extends(EgretExpandUtils, _super);
    /**
     * 构造函数
     */
    function EgretExpandUtils() {
        _super.call(this);
    }
    var d = __define,c=EgretExpandUtils,p=c.prototype;
    /**
     * 初始化函数
     */
    p.init = function () {
        AnchorUtil.init();
    };
    return EgretExpandUtils;
}(BaseClass));
egret.registerClass(EgretExpandUtils,'EgretExpandUtils');
