/**
 *
 * @author
 *
 */
var LoadingScene = (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        _super.call(this);
    }
    var d = __define,c=LoadingScene,p=c.prototype;
    /**
     * 进入Scene调用
     */
    p.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //添加该Scene使用的层级
        this.addLayer(LayerManager.UI_Main);
        //初始打开Loading页面
        App.ViewManager.open(ViewConst.Loading);
    };
    /**
     * 退出Scene调用
     */
    p.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return LoadingScene;
}(BaseScene));
egret.registerClass(LoadingScene,'LoadingScene');
