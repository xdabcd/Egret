/**
 * Created by yangsong on 2014/11/28.
 * 场景管理类
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    /**
     * 构造函数
     */
    function SceneManager() {
        _super.call(this);
        this._scenes = {};
    }
    var d = __define,c=SceneManager,p=c.prototype;
    /**
     * 清空处理
     */
    p.clear = function () {
        var nowScene = this._scenes[this._currScene];
        if (nowScene) {
            nowScene.onExit();
            this._currScene = undefined;
        }
        this._scenes = {};
    };
    /**
     * 注册Scene
     * @param key Scene唯一标识
     * @param scene Scene对象
     */
    p.register = function (key, scene) {
        this._scenes[key] = scene;
    };
    /**
     * 切换场景
     * @param key 场景唯一标识
     */
    p.runScene = function (key) {
        var nowScene = this._scenes[key];
        if (nowScene == null) {
            Log.trace("场景" + key + "不存在");
            return;
        }
        var oldScene = this._scenes[this._currScene];
        if (oldScene) {
            oldScene.onExit();
        }
        nowScene.onEnter();
        this._currScene = key;
    };
    /**
     * 获取当前Scene
     * @returns {number}
     */
    p.getCurrScene = function () {
        return this._currScene;
    };
    return SceneManager;
}(BaseClass));
egret.registerClass(SceneManager,'SceneManager');
