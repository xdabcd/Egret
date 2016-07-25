/**
 * Created by yangsong on 15-1-7.
 */
var BaseEuiLayer = (function (_super) {
    __extends(BaseEuiLayer, _super);
    function BaseEuiLayer() {
        _super.call(this);
        this.percentWidth = 100;
        this.percentHeight = 100;
        this.touchEnabled = false;
    }
    var d = __define,c=BaseEuiLayer,p=c.prototype;
    return BaseEuiLayer;
}(eui.Group));
egret.registerClass(BaseEuiLayer,'BaseEuiLayer');
