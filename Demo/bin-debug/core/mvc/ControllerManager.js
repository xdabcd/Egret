/**
 * Created by yangsong on 2014/11/22.
 * Controller管理类
 */
var ControllerManager = (function (_super) {
    __extends(ControllerManager, _super);
    /**
     * 构造函数
     */
    function ControllerManager() {
        _super.call(this);
        this._modules = {};
    }
    var d = __define,c=ControllerManager,p=c.prototype;
    /**
     * 清空处理
     */
    p.clear = function () {
        this._modules = {};
    };
    /**
     * 动态添加的Controller
     * @param key 唯一标识
     * @param manager Manager
     *
     */
    p.register = function (key, control) {
        if (this.isExists(key))
            return;
        this._modules[key] = control;
    };
    /**
     * 动态移除Controller
     * @param key 唯一标识
     *
     */
    p.unregister = function (key) {
        if (!this.isExists(key))
            return;
        this._modules[key] = null;
        delete this._modules[key];
    };
    /**
     * 是否已经存在Controller
     * @param key 唯一标识
     * @return Boolean
     *
     */
    p.isExists = function (key) {
        return this._modules[key] != null;
    };
    /**
     * 跨模块消息传递
     * @param controllerD Controller唯一标识
     * @param key 消息唯一标识
     *
     */
    p.applyFunc = function (controllerD, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        var manager = this._modules[controllerD];
        if (manager) {
            var params = [];
            for (var i = 1; i < arguments.length; i++) {
                params[i - 1] = arguments[i];
            }
            return manager.applyFunc.apply(manager, params);
        }
        else {
            Log.trace("模块" + controllerD + "不存在");
            return null;
        }
    };
    /**
     * 获取指定Controller的Model对象
     * @param controllerD Controller唯一标识
     * @returns {BaseModel}
     */
    p.getControllerModel = function (controllerD) {
        var manager = this._modules[controllerD];
        if (manager) {
            return manager.getModel();
        }
        return null;
    };
    return ControllerManager;
}(BaseClass));
egret.registerClass(ControllerManager,'ControllerManager');
