/**
 *
 * @author 
 *
 */
enum GameState {
    IDLE = 1,
}


class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
    public constructor() {
        super(GameProxy.NAME);
    }

    /** 初始化底部UI */
    public static INIT: string = "init";

    public init() {
        GameManager.init();
        this.sendNotification(GameProxy.INIT,{ width: StageUtils.getWidth(),height: StageUtils.getHeight(), uiHeight: GameManager.uiHeight});
    }



}