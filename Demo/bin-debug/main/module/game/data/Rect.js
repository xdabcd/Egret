/**
 *
 * @author
 *
 */
var Rect = (function () {
    /**
     * x,y为中心坐标
     */
    function Rect(x, y, width, height, rotation) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
    var d = __define,c=Rect,p=c.prototype;
    p.getPoints = function () {
        var l = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
        var r1 = this.rotation / 180 * Math.PI - Math.atan(this.width / this.height);
        var r2 = this.rotation / 180 * Math.PI + Math.atan(this.width / this.height);
        var r3 = this.rotation / 180 * Math.PI - Math.atan(this.width / this.height) + Math.PI;
        var r4 = this.rotation / 180 * Math.PI + Math.atan(this.width / this.height) + Math.PI;
        var p1 = new egret.Point(this.x + l * Math.sin(r1), this.y - l * Math.cos(r1));
        var p2 = new egret.Point(this.x + l * Math.sin(r2), this.y - l * Math.cos(r2));
        var p3 = new egret.Point(this.x + l * Math.sin(r3), this.y - l * Math.cos(r3));
        var p4 = new egret.Point(this.x + l * Math.sin(r4), this.y - l * Math.cos(r4));
        return [p1, p2, p3, p4];
    };
    p.mult = function (a, b, c) {
        var x1 = a.x;
        var y1 = a.y;
        var x2 = b.x;
        var y2 = b.y;
        var x = c.x;
        var y = c.y;
        return (y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1;
    };
    /**
     * 是否包含点
     */
    p.Contain = function (p) {
        var arr = this.getPoints();
        var m1 = this.mult(arr[0], arr[1], p);
        var m2 = this.mult(arr[3], arr[2], p);
        var m3 = this.mult(arr[1], arr[2], p);
        var m4 = this.mult(arr[0], arr[3], p);
        return (m1 * m2 < 0 && m3 * m4 < 0);
    };
    p.intersectTo = function (r) {
        var arr1 = this.getPoints();
        var arr2 = r.getPoints();
        for (var i = 0; i < arr1.length; i++) {
            if (r.Contain(arr1[i])) {
                return true;
            }
        }
        for (var i = 0; i < arr2.length; i++) {
            if (this.Contain(arr2[i])) {
                return true;
            }
        }
        return false;
    };
    return Rect;
}());
egret.registerClass(Rect,'Rect');
