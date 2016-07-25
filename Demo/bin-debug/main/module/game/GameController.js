/**
 *
 * @author
 *
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        _super.call(this);
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        //注册事件监听
        //        this.registerFunc(LoadingConst.SetProgress,this.setProgress,this);
    }
    var d = __define,c=GameController,p=c.prototype;
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');
