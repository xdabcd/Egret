/**
 *
 * @author
 *
 */
var AppMediator = (function (_super) {
    __extends(AppMediator, _super);
    function AppMediator(viewComponent) {
        _super.call(this, AppMediator.NAME, viewComponent);
    }
    var d = __define,c=AppMediator,p=c.prototype;
    p.listNotificationInterests = function () {
        return [];
    };
    p.handleNotification = function (notification) {
        switch (notification.getName()) {
        }
    };
    d(p, "main"
        ,function () {
            return (this.viewComponent);
        }
    );
    AppMediator.NAME = "AppMediator";
    return AppMediator;
}(puremvc.Mediator));
egret.registerClass(AppMediator,'AppMediator',["puremvc.IMediator","puremvc.INotifier"]);
