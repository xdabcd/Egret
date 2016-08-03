/**
 * Created by yangsong on 2014/11/22.
 * 数学计算工具类
 */
var MathUtils = (function (_super) {
    __extends(MathUtils, _super);
    function MathUtils() {
        _super.apply(this, arguments);
    }
    var d = __define,c=MathUtils,p=c.prototype;
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    p.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    p.getRadian = function (angle) {
        return Math.PI = angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    p.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    p.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    return MathUtils;
}(BaseClass));
egret.registerClass(MathUtils,'MathUtils');
