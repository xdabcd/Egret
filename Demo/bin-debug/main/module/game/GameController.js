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
        this.registerFunc(GameConst.Jump, this.gameView.Jump, this.gameView);
        this.registerFunc(GameConst.Shoot, this.gameView.Shoot, this.gameView);
        this.registerFunc(GameConst.CeateBullet, this.gameView.CreateBullet, this.gameView);
        this.registerFunc(GameConst.RemoveBullet, this.gameView.RemoveBullet, this.gameView);
    }
    var d = __define,c=GameController,p=c.prototype;
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
     * 检测是否超出屏幕
     */
    p.CheckOutScreen = function (object) {
        return !this.hitTest(new egret.Rectangle(object.x, object.y, object.width, object.height), new egret.Rectangle(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight()));
    };
    /**
     * 碰撞检测
     */
    p.hitTest = function (rect1, rect2) {
        return rect1.intersects(rect2);
    };
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');
