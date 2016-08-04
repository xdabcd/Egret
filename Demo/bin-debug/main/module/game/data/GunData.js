/**
 *
 * @author
 *
 */
var GunData = (function () {
    function GunData() {
    }
    var d = __define,c=GunData,p=c.prototype;
    return GunData;
}());
egret.registerClass(GunData,'GunData');
var GunType;
(function (GunType) {
    GunType[GunType["Normal"] = 1] = "Normal";
    GunType[GunType["Running"] = 2] = "Running";
    GunType[GunType["Shot"] = 3] = "Shot";
    GunType[GunType["Boomerang"] = 4] = "Boomerang";
    GunType[GunType["Laser"] = 5] = "Laser";
    GunType[GunType["Freez"] = 6] = "Freez";
})(GunType || (GunType = {}));
