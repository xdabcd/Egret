/**
 *
 * @author
 *
 */
var FreezBullet = (function (_super) {
    __extends(FreezBullet, _super);
    function FreezBullet() {
        _super.apply(this, arguments);
    }
    var d = __define,c=FreezBullet,p=c.prototype;
    p.DoEffect = function (hero) {
        hero.Freez();
    };
    return FreezBullet;
}(NormalBullet));
egret.registerClass(FreezBullet,'FreezBullet');
