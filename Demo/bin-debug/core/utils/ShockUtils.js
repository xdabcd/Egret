/**
 * Created by Channing on 2014/12/6.
 * 震动
 */
var ShockUtils = (function (_super) {
    __extends(ShockUtils, _super);
    function ShockUtils() {
        _super.call(this);
        this.MAP = 0;
        this.SPRITE = 1;
        this.mapPoss = [new egret.Point(0, 3), new egret.Point(0, 0), new egret.Point(0, -2)];
        this.spritePoss = [new egret.Point(5, 0), new egret.Point(-5, 0), new egret.Point(5, 0)];
        this._shockLength = 0;
        this._shockCount = 0;
        this._rx = 0;
        this._ry = 0;
        this._type = 0;
        this._repeatCount = 0;
    }
    var d = __define,c=ShockUtils,p=c.prototype;
    p.destroy = function () {
        this.stop();
    };
    p.shock = function (type, target, repeatCount) {
        if (type === void 0) { type = 0; }
        if (target === void 0) { target = null; }
        if (repeatCount === void 0) { repeatCount = 3; }
        if (this._target) {
            return;
        }
        this._type = type;
        this._target = target;
        if (this._type == this.MAP) {
            this._shockPoss = this.mapPoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        else if (this._type == this.SPRITE) {
            this._shockPoss = this.spritePoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        this.start(repeatCount);
    };
    p.start = function (num) {
        if (num === void 0) { num = 1; }
        this.repeatCount = num;
        this._shockCount = 0;
        if (this._target) {
            if (this._type != this.MAP) {
                this._rx = this._target.x;
            }
            this._ry = this._target.y;
            App.TimerManager.doFrame(1, 0, this.onShockEnter, this);
        }
    };
    p.stop = function () {
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx;
            }
            this._target.y = this._ry;
            App.TimerManager.remove(this.onShockEnter, this);
        }
        this._target = null;
    };
    p.onShockEnter = function (time) {
        var maxCount = this._shockLength * this._repeatCount;
        if (this._shockCount >= maxCount) {
            this.stop();
            return;
        }
        var index = this._shockCount % this._shockLength;
        var pos = this._shockPoss[index];
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx + pos.x;
            }
            this._target.y = this._ry + pos.y;
        }
        this._shockCount++;
    };
    d(p, "repeatCount"
        ,function () {
            return this._repeatCount;
        }
        ,function (value) {
            this._repeatCount = value;
        }
    );
    return ShockUtils;
}(BaseClass));
egret.registerClass(ShockUtils,'ShockUtils');
