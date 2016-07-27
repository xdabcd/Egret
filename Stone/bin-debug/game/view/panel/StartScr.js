var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var StartScr = (function (_super) {
        __extends(StartScr, _super);
        function StartScr() {
            _super.call(this);
            this.skinName = skins.StartScrSkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }
        var d = __define,c=StartScr,p=c.prototype;
        p.createCompleteEvent = function (event) {
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            game.AppFacade.getInstance().registerMediator(new game.StartScrMediator(this));
        };
        return StartScr;
    }(egret.gui.SkinnableComponent));
    game.StartScr = StartScr;
    egret.registerClass(StartScr,'game.StartScr');
})(game || (game = {}));
