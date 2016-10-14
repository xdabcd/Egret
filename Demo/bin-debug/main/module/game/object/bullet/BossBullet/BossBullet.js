/**
 *
 * @author
 *
 */
var BossBullet = (function (_super) {
    __extends(BossBullet, _super);
    function BossBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=BossBullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, id, creater, moveData);
        _super.prototype.setImg.call(this, this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
    };
    p.hitUnit = function (units) {
        _super.prototype.hitUnit.call(this, units);
        for (var i = 0; i < units.length; i++) {
            this.ignoreUnits.push(units[i]);
        }
    };
    return BossBullet;
}(Bullet));
egret.registerClass(BossBullet,'BossBullet');
//# sourceMappingURL=BossBullet.js.map