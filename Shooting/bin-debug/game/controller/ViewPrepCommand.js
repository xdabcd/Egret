/**
 *
 * @author
 *
 */
var ViewPrepCommand = (function (_super) {
    __extends(ViewPrepCommand, _super);
    function ViewPrepCommand() {
        _super.call(this);
    }
    var d = __define,c=ViewPrepCommand,p=c.prototype;
    p.execute = function (notifica) {
        var main = notifica.getBody();
        this.facade.registerMediator(new AppMediator(main));
    };
    return ViewPrepCommand;
}(puremvc.SimpleCommand));
egret.registerClass(ViewPrepCommand,'ViewPrepCommand',["puremvc.ICommand","puremvc.INotifier"]);
