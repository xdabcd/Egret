var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var ControllerPrepCommand = (function (_super) {
        __extends(ControllerPrepCommand, _super);
        function ControllerPrepCommand() {
            _super.call(this);
        }
        var d = __define,c=ControllerPrepCommand,p=c.prototype;
        p.execute = function (notifica) {
            (new game.GameCommand()).register();
            (new game.SceneCommand()).register();
        };
        return ControllerPrepCommand;
    }(puremvc.SimpleCommand));
    game.ControllerPrepCommand = ControllerPrepCommand;
    egret.registerClass(ControllerPrepCommand,'game.ControllerPrepCommand',["puremvc.ICommand","puremvc.INotifier"]);
})(game || (game = {}));
