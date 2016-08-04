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
        var hitHeroes = this.gameController.CheckHitHero(this);
        var hitItem = this.gameController.CheckHitItem(this);
        var outScreen = this.gameController.CheckOutScreen(this);
        if (hitHeroes.length > 0 || hitItem || outScreen) {
            this.remove();
        }
    };
    return NormalBullet;
}(Bullet));
egret.registerClass(NormalBullet,'NormalBullet');
