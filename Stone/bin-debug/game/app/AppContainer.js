var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var AppContainer = (function (_super) {
        __extends(AppContainer, _super);
        function AppContainer() {
            _super.call(this);
            this.startScr = new game.StartScr();
            this.gameScr = new game.GameScr();
        }
        var d = __define,c=AppContainer,p=c.prototype;
        /**
        * 进入开始页面
        */
        p.enterStartScreen = function () {
            this.removeAllElements();
            this.addElement(this.startScr);
        };
        /**
        * 进入游戏页面
        */
        p.enterGameScreen = function () {
            this.removeAllElements();
            this.addElement(this.gameScr);
            if (!this.gameScr.initialized) {
                //在第一次进入游戏页面时立即验证，保证Mediator的注册是及时的，
                //防止注册不及时导致无法接受消息的情况
                this.gameScr.validateNow();
            }
        };
        return AppContainer;
    }(egret.gui.UIStage));
    game.AppContainer = AppContainer;
    egret.registerClass(AppContainer,'game.AppContainer');
})(game || (game = {}));
