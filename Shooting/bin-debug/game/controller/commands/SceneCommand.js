/**
 *
 * @author
 *
 */
var SceneCommand = (function (_super) {
    __extends(SceneCommand, _super);
    function SceneCommand() {
        _super.call(this);
    }
    var d = __define,c=SceneCommand,p=c.prototype;
    /*
     * 注册消息
     */
    p.register = function () {
        this.facade.registerCommand(SceneCommand.CHANGE, SceneCommand);
    };
    p.execute = function (notifica) {
        var data = notifica.getBody();
        var appMediator = this.facade.retrieveMediator(AppMediator.NAME);
        switch (notifica.getName()) {
            case SceneCommand.CHANGE:
                switch (data) {
                    case SceneId.Game:
                        appMediator.main.enterGameScene();
                }
                break;
        }
    };
    SceneCommand.NAME = "SceneCommand";
    /**
    * 切换场景
    */
    SceneCommand.CHANGE = "scene_change";
    return SceneCommand;
}(puremvc.SimpleCommand));
egret.registerClass(SceneCommand,'SceneCommand',["puremvc.ICommand","puremvc.INotifier"]);
