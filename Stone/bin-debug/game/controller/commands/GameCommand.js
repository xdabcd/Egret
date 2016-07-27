var game;
(function (game) {
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
            this.facade.registerCommand(GameCommand.CLICK_GEMSTONE, GameCommand);
            this.facade.registerCommand(GameCommand.HANDLE_COMPLETE, GameCommand);
            this.facade.registerCommand(GameCommand.TO_HANDLE, GameCommand);
            this.facade.registerCommand(GameCommand.FINISH_GAME, GameCommand);
        };
        p.execute = function (notifica) {
            var battleProxy = (this.facade.retrieveProxy(game.BattleProxy.NAME));
            var gridProxy = (this.facade.retrieveProxy(game.GridProxy.NAME));
            var data = notifica.getBody();
            switch (notifica.getName()) {
                case GameCommand.START_GAME: {
                    this.sendNotification(game.SceneCommand.CHANGE, game.SceneId.Game);
                    battleProxy.reset();
                    gridProxy.reset();
                    battleProxy.start();
                    break;
                }
                case GameCommand.CLICK_GEMSTONE: {
                    gridProxy.clickGemstone(data);
                    break;
                }
                case GameCommand.HANDLE_COMPLETE: {
                    battleProxy.doHandleEffect(data);
                    break;
                }
                case GameCommand.TO_HANDLE: {
                    gridProxy.toIdle();
                    break;
                }
                case GameCommand.FINISH_GAME: {
                }
            }
        };
        GameCommand.NAME = "GameCommand";
        /** 开始游戏 */
        GameCommand.START_GAME = "start_game";
        /** 点击宝石 */
        GameCommand.CLICK_GEMSTONE = "click_gemstone";
        /** 操作结束 */
        GameCommand.HANDLE_COMPLETE = "handle_complete";
        /** 去操作 */
        GameCommand.TO_HANDLE = "to_handle";
        /** 结束游戏 */
        GameCommand.FINISH_GAME = "finish_game";
        return GameCommand;
    }(puremvc.SimpleCommand));
    game.GameCommand = GameCommand;
    egret.registerClass(GameCommand,'game.GameCommand',["puremvc.ICommand","puremvc.INotifier"]);
})(game || (game = {}));
