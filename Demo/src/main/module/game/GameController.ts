/**
 *
 * @author 
 *
 */
class GameController extends BaseController {

    private gameView: GameView;
    private gameUIView: GameUIView;
    private lastTime: number;
    
    public constructor() {
        super();

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
    
    private update(){
        var curTime = egret.getTimer();
        var deltaTime = curTime - this.lastTime;
        this.lastTime = curTime;
        console.log(deltaTime);
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
