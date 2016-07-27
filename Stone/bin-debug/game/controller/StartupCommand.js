var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var StartupCommand = (function (_super) {
        __extends(StartupCommand, _super);
        function StartupCommand() {
            _super.call(this);
        }
        var d = __define,c=StartupCommand,p=c.prototype;
        p.initializeMacroCommand = function () {
            this.addSubCommand(game.ControllerPrepCommand);
            this.addSubCommand(game.ModelPrepCommand);
            this.addSubCommand(game.ViewPrepCommand);
        };
        return StartupCommand;
    }(puremvc.MacroCommand));
    game.StartupCommand = StartupCommand;
    egret.registerClass(StartupCommand,'game.StartupCommand');
})(game || (game = {}));
