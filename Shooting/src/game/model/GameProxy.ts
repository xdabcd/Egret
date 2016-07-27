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
    public static INIT_GAME_UI: string = "init_game_ui";

    public init() {
        GameManager.init();
        this.initGameUI();
    }



    private initGameUI() {


    }
}