/**
 *
 * @author
 *
 */
var BulletData = (function () {
    function BulletData() {
    }
    var d = __define,c=BulletData,p=c.prototype;
    return BulletData;
}());
egret.registerClass(BulletData,'BulletData');
var BulletType;
(function (BulletType) {
    BulletType[BulletType["Normal"] = 1] = "Normal";
    BulletType[BulletType["Spin"] = 2] = "Spin";
    BulletType[BulletType["Boomerang"] = 3] = "Boomerang";
    BulletType[BulletType["Laser"] = 4] = "Laser";
})(BulletType || (BulletType = {}));
