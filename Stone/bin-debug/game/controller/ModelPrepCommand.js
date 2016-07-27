var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var ModelPrepCommand = (function (_super) {
        __extends(ModelPrepCommand, _super);
        function ModelPrepCommand() {
            _super.call(this);
        }
        var d = __define,c=ModelPrepCommand,p=c.prototype;
        p.execute = function (notifica) {
            this.facade.registerProxy(new game.BattleProxy());
            this.facade.registerProxy(new game.GridProxy());
        };
        return ModelPrepCommand;
    }(puremvc.SimpleCommand));
    game.ModelPrepCommand = ModelPrepCommand;
    egret.registerClass(ModelPrepCommand,'game.ModelPrepCommand',["puremvc.ICommand","puremvc.INotifier"]);
})(game || (game = {}));
