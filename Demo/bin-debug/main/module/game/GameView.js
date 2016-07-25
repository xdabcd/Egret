/**
 *
 * @author
 *
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView($controller, $parent) {
        _super.call(this, $controller, $parent);
        //        this.skinName = LoadingSceneSkin;
    }
    var d = __define,c=GameView,p=c.prototype;
    return GameView;
}(BaseSpriteView));
egret.registerClass(GameView,'GameView');
