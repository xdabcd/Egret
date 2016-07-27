var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GridSceneMediator = (function (_super) {
        __extends(GridSceneMediator, _super);
        function GridSceneMediator(viewComponent) {
            _super.call(this, GridSceneMediator.NAME, viewComponent);
        }
        var d = __define,c=GridSceneMediator,p=c.prototype;
        p.listNotificationInterests = function () {
            return [
                game.GridProxy.GEMSTONE_CREATE,
                game.GridProxy.GEMSTONE_SELECT,
                game.GridProxy.GEMSTONE_MOVE,
                game.GridProxy.GEMSTONE_UNSELECT,
                game.GridProxy.GEMSTONE_REMOVE,
                game.GridProxy.GEMSTONE_CHANGE_EFFECT
            ];
        };
        p.handleNotification = function (notification) {
            var data = notification.getBody();
            switch (notification.getName()) {
                case game.GridProxy.GEMSTONE_CREATE: {
                    this.gridScene.createGemstoneUI(data);
                    break;
                }
                case game.GridProxy.GEMSTONE_SELECT: {
                    this.gridScene.selectGemstoneUI(data);
                    break;
                }
                case game.GridProxy.GEMSTONE_UNSELECT: {
                    this.gridScene.unGemstoneUI(data);
                    break;
                }
                case game.GridProxy.GEMSTONE_MOVE: {
                    this.gridScene.moveGemstone(data);
                    break;
                }
                case game.GridProxy.GEMSTONE_REMOVE: {
                    this.gridScene.removeGemstone(data);
                    break;
                }
                case game.GridProxy.GEMSTONE_CHANGE_EFFECT: {
                    this.gridScene.changeGemstoneEffect(data);
                    break;
                }
            }
        };
        d(p, "gridScene"
            ,function () {
                return (this.viewComponent);
            }
        );
        GridSceneMediator.NAME = "GridSceneMediator";
        return GridSceneMediator;
    }(puremvc.Mediator));
    game.GridSceneMediator = GridSceneMediator;
    egret.registerClass(GridSceneMediator,'game.GridSceneMediator',["puremvc.IMediator","puremvc.INotifier"]);
})(game || (game = {}));
