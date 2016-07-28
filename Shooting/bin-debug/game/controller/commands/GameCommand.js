/**
 *
 * @author
 *
 */
var GameCommand = (function (_super) {
    __extends(GameCommand, _super);
    function GameCommand() {
        _super.call(this);
    }
    var d = __define,c=GameCommand,p=c.prototype;
    /*
     * 注册消息
     */
    p.register = function () {
        this.facade.registerCommand(GameCommand.START_GAME, GameCommand);
        this.facade.registerCommand(GameCommand.JUMP, GameCommand);
        this.facade.registerCommand(GameCommand.SHOOT, GameCommand);
    };
    p.execute = function (notifica) {
        var gameProxy = (this.facade.retrieveProxy(GameProxy.NAME));
        var data = notifica.getBody();
        switch (notifica.getName()) {
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
    };
    GameCommand.NAME = "GameCommand";
    /** 开始游戏 */
    GameCommand.START_GAME = "start_game";
    /** 跳 */
    GameCommand.JUMP = "jump";
    /** 射击 */
    GameCommand.SHOOT = "shoot";
    return GameCommand;
}(puremvc.SimpleCommand));
egret.registerClass(GameCommand,'GameCommand',["puremvc.ICommand","puremvc.INotifier"]);
