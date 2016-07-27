/**
 * 
 * @author 
 *
 */
class AppContainer extends egret.Stage {
    public constructor() {
        super();
    }

    public gameScene: GameScene = new GameScene();

    /**
    * 进入游戏页面
    */
    public enterGameScene(): void {
        this.removeChildren();
        this.addChild(this.gameScene);
    }
}