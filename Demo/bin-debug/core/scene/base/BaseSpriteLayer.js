/**
 * Created by yangsong on 15-1-7.
 */
var BaseSpriteLayer = (function (_super) {
    __extends(BaseSpriteLayer, _super);
    function BaseSpriteLayer() {
        _super.call(this);
        this.touchEnabled = false;
    }
    var d = __define,c=BaseSpriteLayer,p=c.prototype;
    return BaseSpriteLayer;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseSpriteLayer,'BaseSpriteLayer');
