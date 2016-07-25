/**
 *
 * @author
 *
 */
var GameUIView = (function (_super) {
    __extends(GameUIView, _super);
    function GameUIView($controller, $parent) {
        _super.call(this, $controller, $parent);
        //        this.skinName = LoadingSceneSkin;
    }
    var d = __define,c=GameUIView,p=c.prototype;
    return GameUIView;
}(BaseSpriteView));
egret.registerClass(GameUIView,'GameUIView');
