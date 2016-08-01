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
    GunType[GunType["Narmal"] = 1] = "Narmal";
    GunType[GunType["Running"] = 2] = "Running";
    GunType[GunType["Shot"] = 3] = "Shot";
})(GunType || (GunType = {}));
