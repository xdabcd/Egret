/**
 *
 * @author
 *
 */
var GameSceneMediator = (function (_super) {
    __extends(GameSceneMediator, _super);
    function GameSceneMediator(viewComponent) {
        _super.call(this, GameSceneMediator.NAME, viewComponent);
    }
    var d = __define,c=GameSceneMediator,p=c.prototype;
    p.listNotificationInterests = function () {
        return [
            GameProxy.INIT
        ];
    };
    p.handleNotification = function (notification) {
        var data = notification.getBody();
        switch (notification.getName()) {
            case GameProxy.INIT: {
                this.gameScene.init(data.width, data.height, data.uiHeight);
                break;
            }
        }
    };
    d(p, "gameScene"
        ,function () {
            return (this.viewComponent);
        }
    );
    GameSceneMediator.NAME = "GameSceneMediator";
    return GameSceneMediator;
}(puremvc.Mediator));
egret.registerClass(GameSceneMediator,'GameSceneMediator',["puremvc.IMediator","puremvc.INotifier"]);
