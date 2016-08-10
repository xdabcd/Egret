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
    GameManager.Init = function () {
        var data = RES.getRes("game_json");
        this.ui_h = data["ui_h"];
        var heroes = data["heroes"];
        var guns = data["guns"];
        var bullets = data["bullets"];
        var items = data["items"];
        var stones = data["stones"];
        for (var i = 0; i < heroes.length; i++) {
            var h = heroes[i];
            this.heroDic[h.id] = h;
        }
        for (var i = 0; i < guns.length; i++) {
            var g = guns[i];
            this.gunDic[g.id] = g;
        }
        for (var i = 0; i < bullets.length; i++) {
            var b = bullets[i];
            this.bulletDic[b.id] = b;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.itemDic[item.id] = item;
        }
        for (var i = 0; i < stones.length; i++) {
            var stone = stones[i];
            this.stoneDic[stone.id] = stone;
        }
    };
    /**
     * 获取英雄数据
     */
    GameManager.GetHeroData = function (id) {
        return this.heroDic[id];
    };
    /**
     * 获取枪数据
     */
    GameManager.GetGunData = function (id) {
        return this.gunDic[id];
    };
    /**
     * 获取子弹数据
     */
    GameManager.GetBulletData = function (id) {
        return this.bulletDic[id];
    };
    /**
     * 获取道具数据
     */
    GameManager.GetItemData = function (id) {
        return this.itemDic[id];
    };
    /**
     * 获取石头数据
     */
    GameManager.GetStoneData = function (id) {
        return this.stoneDic[id];
    };
    d(GameManager, "UI_H"
        /**
         * 底部UI高度
         */
        ,function () {
            return this.ui_h;
        }
    );
    GameManager.heroDic = {};
    GameManager.gunDic = {};
    GameManager.bulletDic = {};
    GameManager.itemDic = {};
    GameManager.stoneDic = {};
    return GameManager;
}());
egret.registerClass(GameManager,'GameManager');
