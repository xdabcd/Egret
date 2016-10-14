var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    /**
     * 构造函数
     */
    function ViewManager() {
        _super.call(this);
        this._views = {};
        this._opens = [];
    }
    var d = __define,c=ViewManager,p=c.prototype;
    /**
     * 清空处理
     */
    p.clear = function () {
        this.closeAll();
        this._views = {};
    };
    /**
     * 面板注册
     * @param key 面板唯一标识
     * @param view 面板
     */
    p.register = function (key, view) {
        if (view == null) {
            return;
        }
        if (this._views[key]) {
            return;
        }
        this._views[key] = view;
    };
    /**
     * 面板解除注册
     * @param key
     */
    p.unregister = function (key) {
        if (!this._views[key]) {
            return;
        }
        this._views[key] = null;
        delete this._views[key];
    };
    /**
     * 销毁一个面板
     * @param key 唯一标识
     * @param newView 新面板
     */
    p.destroy = function (key, newView) {
        if (newView === void 0) { newView = null; }
        var oldView = this.getView(key);
        if (oldView) {
            this.unregister(key);
            oldView.destroy();
            oldView = null;
        }
        this.register(key, newView);
    };
    /**
     * 开启面板
     * @param key 面板唯一标识
     * @param param 参数
     *
     */
    p.open = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var view = this.getView(key);
        if (view == null) {
            Log.trace("UI_" + key + "不存在");
            return;
        }
        if (view.isShow()) {
            view.open.apply(view, param);
            return view;
        }
        if (view.isInit()) {
            view.addToParent();
            view.open.apply(view, param);
        }
        else {
            App.EasyLoading.showLoading();
            view.loadResource(function () {
                view.addToParent();
                view.setVisible(false);
            }.bind(this), function () {
                view.initUI();
                view.initData();
                view.open.apply(view, param);
                view.setVisible(true);
                App.EasyLoading.hideLoading();
            }.bind(this));
        }
        this._opens.push(key);
        return view;
    };
    /**
     * 关闭面板
     * @param key 面板唯一标识
     * @param param 参数
     *
     */
    p.close = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (!this.isShow(key)) {
            return;
        }
        var view = this.getView(key);
        if (view == null) {
            return;
        }
        var viewIndex = this._opens.indexOf(key);
        if (key >= 0) {
            this._opens.splice(viewIndex, 1);
        }
        view.removeFromParent();
        view.close.apply(view, param);
    };
    /**
     * 关闭面板
     * @param view
     * @param param
     */
    p.closeView = function (view) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var keys = Object.keys(this._views);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = parseInt(keys[i]);
            if (this._views[key] == view) {
                this.close(key, param);
                return;
            }
        }
    };
    /**
     * 根据唯一标识获取一个UI对象
     * @param key
     * @returns {any}
     */
    p.getView = function (key) {
        return this._views[key];
    };
    /**
     * 关闭所有开启中的UI
     */
    p.closeAll = function () {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    };
    /**
     * 当前ui打开数量
     * @returns {number}
     */
    p.currOpenNum = function () {
        return this._opens.length;
    };
    /**
     * 检测一个UI是否开启中
     * @param key
     * @returns {boolean}
     */
    p.isShow = function (key) {
        return this._opens.indexOf(key) != -1;
    };
    return ViewManager;
}(BaseClass));
egret.registerClass(ViewManager,'ViewManager');
//# sourceMappingURL=ViewManager.js.map