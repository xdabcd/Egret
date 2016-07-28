/**
 *
 * @author 
 *
 */
class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
    public constructor() {
        super();
    }

    public static NAME: string = "GameCommand";

    /** 开始游戏 */
    public static START_GAME: string = "start_game";
    /** 跳 */
    public static JUMP: string = "jump";
    /** 射击 */
    public static SHOOT: string = "shoot";

    /*
     * 注册消息
     */ 
    public register(): void {
        this.facade.registerCommand(GameCommand.START_GAME,GameCommand);
        this.facade.registerCommand(GameCommand.JUMP,GameCommand);
        this.facade.registerCommand(GameCommand.SHOOT,GameCommand);
    }

    public execute(notifica: puremvc.INotification): void {
        var gameProxy: GameProxy = <GameProxy><any>(this.facade.retrieveProxy(GameProxy.NAME));
        var data: any = notifica.getBody();
        switch(notifica.getName()) {
            case GameCommand.START_GAME: {
                AppFacade.getInstance().sendNotification(SceneCommand.CHANGE, SceneId.Game);
                gameProxy.init();
                break;
            }

            case GameCommand.JUMP: {

                break;
            }

            case GameCommand.SHOOT: {

                break;
            }
        }
    }
}