/**
 * Created by yangsong on 15-4-21.
 * 单一资源通过版本号加载管理类
 */
var ResVersionManager = (function (_super) {
    __extends(ResVersionManager, _super);
    /**
     * 构造函数
     */
    function ResVersionManager() {
        _super.call(this);
        this.res_loadByVersion();
    }
    var d = __define,c=ResVersionManager,p=c.prototype;
    /**
     * Res加载使用版本号的形式
     */
    p.res_loadByVersion = function () {
        RES.web.Html5VersionController.prototype.getVirtualUrl = function (url) {
            var version = "";
            var resVersion = ResVersionManager.resVersionData;
            var urlTemp = url.substring(9);
            if (resVersion && resVersion[urlTemp]) {
                version = resVersion[urlTemp];
            }
            if (version.length == 0) {
                version = Math.random() + "";
            }
            if (url.indexOf("?") == -1) {
                url += "?v=" + version;
            }
            else {
                url += "&v=" + version;
            }
            return url;
        };
    };
    /**
     * 加载资源版本号配置文件
     * @param url 配置文件路径
     * @param complateFunc 加载完成执行函数
     * @param complateFuncTarget 加载完成执行函数所属对象
     */
    p.loadConfig = function (url, complateFunc, complateFuncTarget) {
        this.complateFunc = complateFunc;
        this.complateFuncTarget = complateFuncTarget;
        RES.getResByUrl(url, this.loadResVersionComplate, this);
    };
    /**
     * 配置文件加载完成
     * @param data
     */
    p.loadResVersionComplate = function (data) {
        ResVersionManager.resVersionData = data;
        this.complateFunc.call(this.complateFuncTarget);
    };
    return ResVersionManager;
}(BaseClass));
egret.registerClass(ResVersionManager,'ResVersionManager');
