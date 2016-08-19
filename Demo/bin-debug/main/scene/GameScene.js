/**
 *
 * @author
 *
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
    }
    var d = __define,c=GameScene,p=c.prototype;
    /**
     * 进入Scene调用
     */
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //添加该Scene使用的层级
        this.addLayer(LayerManager.Game_Main);
        this.addLayer(LayerManager.Game_UI);
        this.addLayer(LayerManager.UI_Pop);
        //初始打开Game和GameUI
        App.ViewManager.open(ViewConst.Game);
        App.ViewManager.open(ViewConst.GameUI);
    };
    /**
     * 退出Scene调用
     */
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return GameScene;
}(BaseScene));
egret.registerClass(GameScene,'GameScene');
