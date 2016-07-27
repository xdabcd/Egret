var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GameScrMediator = (function (_super) {
        __extends(GameScrMediator, _super);
        function GameScrMediator(viewComponent) {
            _super.call(this, game.StartScrMediator.NAME, viewComponent);
        }
        var d = __define,c=GameScrMediator,p=c.prototype;
        GameScrMediator.NAME = "GameScrMediator";
        return GameScrMediator;
    }(puremvc.Mediator));
    game.GameScrMediator = GameScrMediator;
    egret.registerClass(GameScrMediator,'game.GameScrMediator',["puremvc.IMediator","puremvc.INotifier"]);
})(game || (game = {}));
