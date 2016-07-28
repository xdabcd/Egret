/**
 *
 * @author 
 *
 */
class AnchorUtils {
    private static _propertyChange:any;
    private static _anchorChange:any;

    public static init() {
        AnchorUtils._propertyChange = Object.create(null);
        AnchorUtils._anchorChange = Object.create(null);
        AnchorUtils.injectAnchor();
    }

    public static setAnchorX(target:egret.DisplayObject, value:number):void {
        target["anchorX"] = value;
    }

    public static setAnchorY(target:egret.DisplayObject, value:number):void {
        target["anchorY"] = value;
    }

    public static setAnchor(target:egret.DisplayObject, value:number):void {
        target["anchorX"] = target["anchorY"] = value;
    }

    public static getAnchor(target:egret.DisplayObject):number {
        if (target["anchorX"] != target["anchorY"]) {
            console.log("target's anchorX != anchorY");
        }
        return target["anchorX"] || 0;
    }

    public static getAnchorY(target:egret.DisplayObject):number {
        return target["anchorY"] || 0;
    }

    public static getAnchorX(target:egret.DisplayObject):number {
        return target["anchorX"] || 0;
    }

    private static injectAnchor():void {
        Object.defineProperty(egret.DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                this.$setWidth(value);
                AnchorUtils._propertyChange[this.hashCode] = true;
                egret.callLater(()=> {
                    AnchorUtils.changeAnchor(this);
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
                this.$setHeight(value);
                AnchorUtils._propertyChange[this.hashCode] = true;
                egret.callLater(()=> {
                    AnchorUtils.changeAnchor(this);
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
                this._anchorX = value;
                AnchorUtils._propertyChange[this.hashCode] = true;
                AnchorUtils._anchorChange[this.hashCode] = true;
                egret.callLater(()=> {
                    AnchorUtils.changeAnchor(this);
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
                this._anchorY = value;
                AnchorUtils._propertyChange[this.hashCode] = true;
                AnchorUtils._anchorChange[this.hashCode] = true;
                egret.callLater(()=> {
                    AnchorUtils.changeAnchor(this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
    }

    private static changeAnchor(tar:any):void {
        if (AnchorUtils._propertyChange[tar.hashCode] && AnchorUtils._anchorChange[tar.hashCode]) {
            tar.anchorOffsetX = tar._anchorX * tar.width;
            tar.anchorOffsetY = tar._anchorY * tar.height;
            delete AnchorUtils._propertyChange[tar.hashCode];
        }
    }
}
