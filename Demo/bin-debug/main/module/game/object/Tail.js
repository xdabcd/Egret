/**
 *
 * @author
 *
 */
var Tail = (function (_super) {
    __extends(Tail, _super);
    function Tail() {
        _super.call(this);
        this.mPoints = [];
        this.mg = this.graphics;
    }
    var d = __define,c=Tail,p=c.prototype;
    p.init = function (size, color) {
        this.size = size;
        this.color = color;
        this.state = 1;
        App.TimerManager.doFrame(1, 0, this.update, this);
    };
    p.addPoint = function (x, y) {
        var obj = { sx: x, sy: y, size: this.size };
        this.mPoints.push(obj);
    };
    p.clear = function () {
        this.state = 2;
    };
    p.update = function (time) {
        if (this.mPoints.length == 0)
            return;
        if (this.state == 2) {
            this.mPoints.splice(i, 1);
            if (this.mPoints.length == 0) {
                this.destory();
            }
        }
        this.mg.clear();
        var _count = this.mPoints.length;
        for (var i = 0; i < _count; i++) {
            var pt = this.mPoints[i];
            pt.size -= 2;
            if (pt.size < 0) {
                this.mPoints.splice(i, 1);
                i--;
                _count = this.mPoints.length;
            }
        }
        _count = this.mPoints.length;
        var alpha = 0.1;
        for (i = 1; i < _count; i++) {
            var p = this.mPoints[i];
            var count = 5;
            var sx = this.mPoints[i - 1].sx;
            var sy = this.mPoints[i - 1].sy;
            var sx1 = p.sx;
            var sy1 = p.sy;
            var size = this.mPoints[i - 1].size;
            var size1 = p.size;
            for (var j = 0; j < count; j++) {
                this.mg.lineStyle(size + (size1 - size) / count * j, this.color, alpha);
                this.mg.moveTo(sx + (sx1 - sx) / count * j, sy + (sy1 - sy) / count * j);
                this.mg.lineTo(sx + (sx1 - sx) / count * (j + 1), sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    };
    p.destory = function () {
        App.TimerManager.remove(this.update, this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    return Tail;
}(egret.Shape));
egret.registerClass(Tail,'Tail');
//# sourceMappingURL=Tail.js.map