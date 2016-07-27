/**
 *
 * @author
 *
 */
var ModelPrepCommand = (function (_super) {
    __extends(ModelPrepCommand, _super);
    function ModelPrepCommand() {
        _super.call(this);
    }
    var d = __define,c=ModelPrepCommand,p=c.prototype;
    p.execute = function (notifica) {
        this.facade.registerProxy(new GameProxy());
    };
    return ModelPrepCommand;
}(puremvc.SimpleCommand));
egret.registerClass(ModelPrepCommand,'ModelPrepCommand',["puremvc.ICommand","puremvc.INotifier"]);
