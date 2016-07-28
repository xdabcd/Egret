/**
 *
 * @author
 *
 */
var GameManager = (function () {
    function GameManager() {
    }
    var d = __define,c=GameManager,p=c.prototype;
    /**
     * 初始化游戏数据
     */
    GameManager.init = function () {
        var data = RES.getRes("game_json");
        this._uiHeight = data["ui_height"];
        var heroes = data["heroes"];
        var guns = data["guns"];
        var bullets = data["bullets"];
        for (var i = 0; i < heroes.length; i++) {
            var h = heroes[i];
            this._heroDic[h.id] = h;
        }
        for (var i = 0; i < guns.length; i++) {
            var g = guns[i];
            this._gunDic[g.id] = g;
        }
        for (var i = 0; i < bullets.length; i++) {
            var b = bullets[i];
            this._bulletDic[b.id] = b;
        }
    };
    /**
     * 获取英雄数据
     */
    GameManager.getHeroData = function (id) {
        return this._heroDic[id];
    };
    /**
     * 获取枪数据
     */
    GameManager.getGunData = function (id) {
        return this._gunDic[id];
    };
    /**
     * 获取子弹数据
     */
    GameManager.getBulletData = function (id) {
        return this._bulletDic[id];
    };
    d(GameManager, "uiHeight"
        /**
         * 底部UI高度
         */
        ,function () {
            return this._uiHeight;
        }
    );
    GameManager._heroDic = {};
    GameManager._gunDic = {};
    GameManager._bulletDic = {};
    return GameManager;
}());
egret.registerClass(GameManager,'GameManager');
