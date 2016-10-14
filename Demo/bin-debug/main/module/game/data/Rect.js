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
    p.between = function (a, X0, X1) {
        var temp1 = a - X0;
        var temp2 = a - X1;
        if ((temp1 < 1e-8 && temp2 > -1e-8) || (temp2 < 1e-6 && temp1 > -1e-8)) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * 判断两条直线段是否有交点
     * p1,p2是直线一的端点坐标
     * p3,p4是直线二的端点坐标
     */
    p.detectIntersect = function (p1, p2, p3, p4) {
        var line_x, line_y; //交点  
        if ((Math.abs(p1.x - p2.x) < 1e-6) && (Math.abs(p3.x - p4.x) < 1e-6)) {
            return false;
        }
        else if ((Math.abs(p1.x - p2.x) < 1e-6)) {
            if (this.between(p1.x, p3.x, p4.x)) {
                var k = (p4.y - p3.y) / (p4.x - p3.x);
                line_x = p1.x;
                line_y = k * (line_x - p3.x) + p3.y;
                if (this.between(line_y, p1.y, p2.y)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else if ((Math.abs(p3.x - p4.x) < 1e-6)) {
            if (this.between(p3.x, p1.x, p2.x)) {
                var k = (p2.y - p1.y) / (p2.x - p1.x);
                line_x = p3.x;
                line_y = k * (line_x - p2.x) + p2.y;
                if (this.between(line_y, p3.y, p4.y)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            var k1 = (p2.y - p1.y) / (p2.x - p1.x);
            var k2 = (p4.y - p3.y) / (p4.x - p3.x);
            if (Math.abs(k1 - k2) < 1e-6) {
                return false;
            }
            else {
                line_x = ((p3.y - p1.y) - (k2 * p3.x - k1 * p1.x)) / (k1 - k2);
                line_y = k1 * (line_x - p1.x) + p1.y;
            }
            if (this.between(line_x, p1.x, p2.x) && this.between(line_x, p3.x, p4.x)) {
                return true;
            }
            else {
                return false;
            }
        }
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
        for (var i = 0; i < arr1.length; i++) {
            var p1 = arr1[i];
            var p2;
            if (i < arr1.length - 1) {
                p2 = arr1[i + 1];
            }
            else {
                p2 = arr1[0];
            }
            for (var j = 0; j < arr2.length; j++) {
                var p3 = arr2[j];
                var p4;
                if (j < arr2.length - 1) {
                    p4 = arr2[j + 1];
                }
                else {
                    p4 = arr2[0];
                }
                if (this.detectIntersect(p1, p2, p3, p4)) {
                    return true;
                }
            }
        }
        return false;
    };
    return Rect;
}());
egret.registerClass(Rect,'Rect');
//# sourceMappingURL=Rect.js.map