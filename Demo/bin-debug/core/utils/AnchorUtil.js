/**
 * Created by Saco on 2015/9/16.
 */
var AnchorUtil = (function () {
    function AnchorUtil() {
    }
    var d = __define,c=AnchorUtil,p=c.prototype;
    AnchorUtil.init = function () {
        AnchorUtil._propertyChange = Object.create(null);
        AnchorUtil._anchorChange = Object.create(null);
        AnchorUtil.injectAnchor();
    };
    AnchorUtil.setAnchorX = function (target, value) {
        target["anchorX"] = value;
    };
    AnchorUtil.setAnchorY = function (target, value) {
        target["anchorY"] = value;
    };
    AnchorUtil.setAnchor = function (target, value) {
        target["anchorX"] = target["anchorY"] = value;
    };
    AnchorUtil.getAnchor = function (target) {
        if (target["anchorX"] != target["anchorY"]) {
            console.log("target's anchorX != anchorY");
        }
        return target["anchorX"] || 0;
    };
    AnchorUtil.getAnchorY = function (target) {
        return target["anchorY"] || 0;
    };
    AnchorUtil.getAnchorX = function (target) {
        return target["anchorX"] || 0;
    };
    AnchorUtil.injectAnchor = function () {
        Object.defineProperty(egret.DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                var _this = this;
                this.$setWidth(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            set: function (value) {
                var _this = this;
                this.$setHeight(value);
                AnchorUtil._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorX", {
            get: function () {
                return this._anchorX;
            },
            set: function (value) {
                var _this = this;
                this._anchorX = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorY", {
            get: function () {
                return this._anchorY;
            },
            set: function (value) {
                var _this = this;
                this._anchorY = value;
                AnchorUtil._propertyChange[this.hashCode] = true;
                AnchorUtil._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    AnchorUtil.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
    };
    AnchorUtil.changeAnchor = function (tar) {
        if (AnchorUtil._propertyChange[tar.hashCode] && AnchorUtil._anchorChange[tar.hashCode]) {
            tar.anchorOffsetX = tar._anchorX * tar.width;
            tar.anchorOffsetY = tar._anchorY * tar.height;
            delete AnchorUtil._propertyChange[tar.hashCode];
        }
    };
    return AnchorUtil;
}());
egret.registerClass(AnchorUtil,'AnchorUtil');
