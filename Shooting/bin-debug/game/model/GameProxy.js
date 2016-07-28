/**
 *
 * @author
 *
 */
var GameState;
(function (GameState) {
    GameState[GameState["IDLE"] = 1] = "IDLE";
})(GameState || (GameState = {}));
var GameProxy = (function (_super) {
    __extends(GameProxy, _super);
    function GameProxy() {
        _super.call(this, GameProxy.NAME);
    }
    var d = __define,c=GameProxy,p=c.prototype;
    p.init = function () {
        GameManager.init();
        this.sendNotification(GameProxy.INIT, { width: StageUtils.getWidth(), height: StageUtils.getHeight(), uiHeight: GameManager.uiHeight });
    };
    /** 初始化底部UI */
    GameProxy.INIT = "init";
    return GameProxy;
}(puremvc.Proxy));
egret.registerClass(GameProxy,'GameProxy',["puremvc.IProxy","puremvc.INotifier"]);
