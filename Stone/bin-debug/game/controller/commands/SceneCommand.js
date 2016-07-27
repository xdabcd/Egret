var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var SceneCommand = (function (_super) {
        __extends(SceneCommand, _super);
        function SceneCommand() {
            _super.call(this);
        }
        var d = __define,c=SceneCommand,p=c.prototype;
        /*
         * 注册消息
         */
        p.register = function () {
            this.facade.registerCommand(SceneCommand.CHANGE, SceneCommand);
        };
        p.execute = function (notifica) {
            var data = notifica.getBody();
            var appMediator = this.facade.retrieveMediator(game.AppMediator.NAME);
            switch (notifica.getName()) {
                case SceneCommand.CHANGE:
                    switch (data) {
                        case game.SceneId.Start:
                            appMediator.main.enterStartScreen();
                            break;
                        case game.SceneId.Game:
                            appMediator.main.enterGameScreen();
                    }
                    break;
            }
        };
        SceneCommand.NAME = "SceneCommand";
        /**
        * 切换场景
        */
        SceneCommand.CHANGE = "scene_change";
        return SceneCommand;
    }(puremvc.SimpleCommand));
    game.SceneCommand = SceneCommand;
    egret.registerClass(SceneCommand,'game.SceneCommand',["puremvc.ICommand","puremvc.INotifier"]);
})(game || (game = {}));
