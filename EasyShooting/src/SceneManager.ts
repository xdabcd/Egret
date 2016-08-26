/**
 *
 * 场景管理器
 *
 */
class SceneManager {
    
    /** 舞台 */
    private static _stage: egret.Stage;
    /** 游戏场景 */
    private static _gameScene: GameScene = new GameScene;

    /**
     * 初始化
     */ 
    public static init(stage: egret.Stage){
        this._stage = stage;
    }
    
    /**
    * 进入游戏页面
    */
    public static enterGameScene(): void {
        this._stage.removeChildren(); 
        this._stage.addChild(this._gameScene);
    }
}
