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
