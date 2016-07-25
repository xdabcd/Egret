/**
 * Created by yangsong on 2014/11/22.
 * View基类，继承自egret.Sprite
 */
var BaseSpriteView = (function (_super) {
    __extends(BaseSpriteView, _super);
    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
     */
    function BaseSpriteView($controller, $parent) {
        _super.call(this);
        this._resources = null;
        this._controller = $controller;
        this._myParent = $parent;
        this._isInit = false;
        App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, this.onResize, this);
    }
    var d = __define,c=BaseSpriteView,p=c.prototype;
    /**
     * 设置初始加载资源
     * @param resources
     */
    p.setResources = function (resources) {
        this._resources = resources;
    };
    d(p, "myParent"
        /**
         * 获取我的父级
         * @returns {egret.DisplayObjectContainer}
         */
        ,function () {
            return this._myParent;
        }
    );
    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    p.isInit = function () {
        return this._isInit;
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
     *
     */
    p.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
     *
     */
    p.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * 面板是否显示
     * @return
     *
     */
    p.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * 添加到父级
     */
    p.addToParent = function () {
        this._myParent.addChild(this);
    };
    /**
     * 从父级移除
     */
    p.removeFromParent = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    p.initUI = function () {
        this._isInit = true;
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    p.initData = function () {
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    p.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    p.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i - 0] = arguments[_i];
        }
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    };
    /**
     * 屏幕尺寸变化时调用
     */
    p.onResize = function () {
    };
    /**
     * 加载面板所需资源
     * @param loadComplete
     * @param initComplete
     */
    p.loadResource = function (loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            App.ResourceUtils.loadResource(this._resources, [], function () {
                loadComplete();
                initComplete();
            }, null, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    };
    /**
     * 设置是否隐藏
     * @param value
     */
    p.setVisible = function (value) {
        this.visible = value;
    };
    return BaseSpriteView;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseSpriteView,'BaseSpriteView',["IBaseView"]);
