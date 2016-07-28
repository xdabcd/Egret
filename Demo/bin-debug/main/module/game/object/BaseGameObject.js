/**
 *
 * @author
 *
 */
var BaseGameObject = (function (_super) {
    __extends(BaseGameObject, _super);
    function BaseGameObject($controller) {
        _super.call(this);
        this.originX = 0;
        this.originY = 0;
        this.controller = $controller;
    }
    var d = __define,c=BaseGameObject,p=c.prototype;
    p.init = function (side) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._side = side;
        App.TimerManager.doFrame(1, 0, this.onFrame, this);
    };
    p.destory = function () {
        App.TimerManager.remove(this.onFrame, this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    p.onFrame = function (time) {
        this.update(time);
        this.setPos();
    };
    p.setPos = function () {
        if (this.$getX() != this.originX) {
            this.$setX(this.originX);
        }
        if (this.$getY() != this.originY) {
            this.$setY(this.originY);
        }
    };
    p.update = function (time) {
    };
    d(p, "x"
        ,function () {
            return this.originX;
        }
        ,function (value) {
            this.originX = value;
        }
    );
    d(p, "y"
        ,function () {
            return this.originY;
        }
        ,function (value) {
            this.originY = value;
        }
    );
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
    return BaseGameObject;
}(egret.DisplayObjectContainer));
egret.registerClass(BaseGameObject,'BaseGameObject');
var Side;
(function (Side) {
    Side[Side["Own"] = 0] = "Own";
    Side[Side["Enemy"] = 1] = "Enemy";
})(Side || (Side = {}));
