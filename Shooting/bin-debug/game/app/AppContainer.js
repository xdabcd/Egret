/**
 *
 * @author
 *
 */
var AppContainer = (function (_super) {
    __extends(AppContainer, _super);
    function AppContainer() {
        _super.call(this);
        this.gameScene = new GameScene();
    }
    var d = __define,c=AppContainer,p=c.prototype;
    /**
    * 进入游戏页面
    */
    p.enterGameScene = function () {
        this.removeChildren();
        this.addChild(this.gameScene);
    };
    return AppContainer;
}(egret.DisplayObjectContainer));
egret.registerClass(AppContainer,'AppContainer');
