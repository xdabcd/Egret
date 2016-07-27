var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var StartScrMediator = (function (_super) {
        __extends(StartScrMediator, _super);
        function StartScrMediator(viewComponent) {
            _super.call(this, StartScrMediator.NAME, viewComponent);
            this.startScr.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startButtonClick, this);
        }
        var d = __define,c=StartScrMediator,p=c.prototype;
        p.startButtonClick = function (event) {
            this.sendNotification(game.GameCommand.START_GAME);
        };
        d(p, "startScr"
            ,function () {
                return (this.viewComponent);
            }
        );
        StartScrMediator.NAME = "StartScrMediator";
        return StartScrMediator;
    }(puremvc.Mediator));
    game.StartScrMediator = StartScrMediator;
    egret.registerClass(StartScrMediator,'game.StartScrMediator',["puremvc.IMediator","puremvc.INotifier"]);
})(game || (game = {}));
