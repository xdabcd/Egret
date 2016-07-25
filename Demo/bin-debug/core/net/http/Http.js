/**
 * Created by yangsong on 2014/11/22.
 * Http请求处理
 */
var Http = (function (_super) {
    __extends(Http, _super);
    /**
     * 构造函数
     */
    function Http() {
        _super.call(this);
        this._data = new DynamicChange();
        this._cache = [];
        this._request = new egret.URLRequest();
        this._request.method = egret.URLRequestMethod.POST;
        this._urlLoader = new egret.URLLoader();
        this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
    }
    var d = __define,c=Http,p=c.prototype;
    /**
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    p.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    d(p, "Data"
        /**
         * 数据缓存
         * @returns {DynamicChange}
         * @constructor
         */
        ,function () {
            return this._data;
        }
    );
    /**
     * Http错误处理函数
     * @param e
     */
    p.onError = function (e) {
        this.nextPost();
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    p.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.post();
    };
    /**
     * 请求服务器
     */
    p.post = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        var type = arr[0];
        var urlVariables = arr[1];
        this._type = type;
        this._request.url = this._serverUrl;
        this._request.data = urlVariables;
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
    };
    /**
     * 数据返回
     * @param event
     */
    p.onLoaderComplete = function (event) {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            this._data.pUpdate.update(this._type, t_obj);
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.trace("Http错误:" + t_obj["s"]);
        }
        this.nextPost();
    };
    /**
     * 开始下一个请求
     */
    p.nextPost = function () {
        this._isRequesting = false;
        this.post();
    };
    return Http;
}(BaseClass));
egret.registerClass(Http,'Http');
