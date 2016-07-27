/**
 *
 * @author 
 *
 */
class GameController extends BaseController {

    private gameView: GameView;
    private gameUIView: GameUIView;
    
    public constructor() {
        super();

        //初始化数据
        GameManager.Init();
        
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        
        this.registerFunc(GameConst.Jump, this.jump, this);
    }
    
    private jump(up: Boolean): void {
        this.gameView.SetHeroUp(up);
    }
    
    public CreateBullet(): void{
//        this.gameView.cre
    }
    
    /**
     * 检测英雄是否超出范围(Y轴)
     */ 
    public CheckHeroOut(hero: Hero): Boolean{
        if(hero.y - hero.anchorOffsetY < this.gameView.min_y){
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }else if(hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y){
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
    }
    
    /**
     * 碰撞检测
     */ 
    private hitTest(obj1: egret.DisplayObject,obj2: egret.DisplayObject): boolean {
        var rect1: egret.Rectangle = obj1.getBounds();
        var rect2: egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }
}
