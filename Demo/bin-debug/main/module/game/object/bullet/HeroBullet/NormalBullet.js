/**
 *
 * @author
 *
 */
var NormalBullet = (function (_super) {
    __extends(NormalBullet, _super);
    function NormalBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=NormalBullet,p=c.prototype;
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
        this.remove();
    };
    p.hitItems = function (items) {
        _super.prototype.hitItems.call(this, items);
        this.remove();
    };
    p.outScreen = function () {
        _super.prototype.outScreen.call(this);
    };
    return NormalBullet;
}(HeroBullet));
egret.registerClass(NormalBullet,'NormalBullet');
//# sourceMappingURL=NormalBullet.js.map