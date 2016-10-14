/**
 *
 * @author
 *
 */
var BaseGameObject = (function (_super) {
    __extends(BaseGameObject, _super);
    function BaseGameObject($controller) {
        _super.call(this);
        this.showRect = true;
        this.controller = $controller;
    }
    var d = __define,c=BaseGameObject,p=c.prototype;
    p.init = function (side) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._side = side;
        AnchorUtil.setAnchor(this, 0.5);
        App.TimerManager.doFrame(1, 0, this.onFrame, this);
    };
    p.destory = function () {
        App.TimerManager.remove(this.onFrame, this);
        App.DisplayUtils.removeFromParent(this);
        if (this.hitRect != null) {
            App.DisplayUtils.removeFromParent(this.hitRect);
            this.hitRect = null;
        }
        ObjectPool.push(this);
    };
    p.onFrame = function (time) {
        this.update(time);
        if (this.showRect && this.parent != null) {
            if (this.hitRect == null) {
                this.hitRect = new egret.Shape;
                this.parent.addChild(this.hitRect);
            }
            else {
                var arr = this.rect.getPoints();
                this.hitRect.graphics.clear();
                for (var i = 0; i < arr.length; i++) {
                    var cur = arr[i];
                    var next;
                    if (i < arr.length - 1) {
                        next = arr[i + 1];
                    }
                    else {
                        next = arr[0];
                    }
                    this.hitRect.graphics.lineStyle(10, 0xff00000, 0.5);
                    this.hitRect.graphics.moveTo(cur.x, cur.y);
                    this.hitRect.graphics.lineTo(next.x, next.y);
                }
            }
        }
    };
    p.update = function (time) {
    };
    d(p, "gameController"
        ,function () {
            return this.controller;
        }
    );
    d(p, "side"
        ,function () {
            return this._side;
        }
    );
    d(p, "rect"
        ,function () {
            return new Rect(this.x, this.y, this.width, this.height, this.rotation);
        }
    );
    return BaseGameObject;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseGameObject,'BaseGameObject');
var Side;
(function (Side) {
    Side[Side["Own"] = 0] = "Own";
    Side[Side["Enemy"] = 1] = "Enemy";
    Side[Side["Middle"] = 2] = "Middle";
})(Side || (Side = {}));
//# sourceMappingURL=BaseGameObject.js.map