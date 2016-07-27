/**
 *
 * @author
 *
 */
var ControllerPrepCommand = (function (_super) {
    __extends(ControllerPrepCommand, _super);
    function ControllerPrepCommand() {
        _super.call(this);
    }
    var d = __define,c=ControllerPrepCommand,p=c.prototype;
    p.execute = function (notifica) {
        (new GameCommand()).register();
        (new SceneCommand()).register();
    };
    return ControllerPrepCommand;
}(puremvc.SimpleCommand));
egret.registerClass(ControllerPrepCommand,'ControllerPrepCommand',["puremvc.ICommand","puremvc.INotifier"]);
