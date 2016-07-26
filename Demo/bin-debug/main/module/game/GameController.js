/**
 *
 * @author
 *
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        _super.call(this);
        //初始化数据
        GameManager.Init();
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        this.lastTime = egret.getTimer();
        this.gameView.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
    }
    var d = __define,c=GameController,p=c.prototype;
    p.update = function () {
        var curTime = egret.getTimer();
        var deltaTime = curTime - this.lastTime;
        this.lastTime = curTime;
        console.log(deltaTime);
    };
    /**
     * 碰撞检测
     */
    p.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    };
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');
