var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GameScr = (function (_super) {
        __extends(GameScr, _super);
        function GameScr() {
            _super.call(this);
            this.skinName = skins.GameScrSkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }
        var d = __define,c=GameScr,p=c.prototype;
        p.createCompleteEvent = function (event) {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            game.AppFacade.getInstance().registerMediator(new game.GameScrMediator(this));
        };
        return GameScr;
    }(egret.gui.SkinnableComponent));
    game.GameScr = GameScr;
    egret.registerClass(GameScr,'game.GameScr');
})(game || (game = {}));
