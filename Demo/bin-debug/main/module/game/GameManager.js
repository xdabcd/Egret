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
        GameManager.Bottom_H = data["bottom_h"];
        var heroes = data["heroes"];
        var guns = data["guns"];
        var bullets = data["bullets"];
        for (var i = 0; i < heroes.length; i++) {
            var h = heroes[i];
            GameManager.HeroDic[h.id] = h;
        }
        for (var i = 0; i < guns.length; i++) {
            var g = guns[i];
            GameManager.GunDic[g.id] = g;
        }
        for (var i = 0; i < bullets.length; i++) {
            var b = bullets[i];
            GameManager.BulletDic[b.id] = b;
        }
    };
    GameManager.HeroDic = {};
    GameManager.GunDic = {};
    GameManager.BulletDic = {};
    return GameManager;
}());
egret.registerClass(GameManager,'GameManager');
