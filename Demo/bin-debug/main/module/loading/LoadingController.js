/**
 *
 * @author
 *
 */
var LoadingController = (function (_super) {
    __extends(LoadingController, _super);
    function LoadingController() {
        _super.call(this);
        //初始化UI
        this.loadingView = new LoadingView(this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Loading, this.loadingView);
        //注册事件监听
        this.registerFunc(LoadingConst.SetProgress, this.setProgress, this);
    }
    var d = __define,c=LoadingController,p=c.prototype;
    p.setProgress = function (value, total) {
        this.loadingView.setProgress(value, total);
    };
    return LoadingController;
}(BaseController));
egret.registerClass(LoadingController,'LoadingController');
