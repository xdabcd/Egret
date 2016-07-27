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
        this.registerFunc(GameConst.Jump, this.jump, this);
    }
    var d = __define,c=GameController,p=c.prototype;
    p.jump = function (up) {
        this.gameView.SetHeroUp(up);
    };
    p.CreateBullet = function () {
        //        this.gameView.cre
    };
    /**
     * 检测英雄是否超出范围(Y轴)
     */
    p.CheckHeroOut = function (hero) {
        if (hero.y - hero.anchorOffsetY < this.gameView.min_y) {
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }
        else if (hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y) {
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
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
