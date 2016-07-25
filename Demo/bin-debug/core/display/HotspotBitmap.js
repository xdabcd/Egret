/**
 * Created by Saco on 2014/12/1.
 */
var HotspotBitmap = (function (_super) {
    __extends(HotspotBitmap, _super);
    function HotspotBitmap() {
        _super.call(this);
        this._hotspot = [];
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    }
    var d = __define,c=HotspotBitmap,p=c.prototype;
    p.addHotspotArea = function (rect, callBack, thisObj, para) {
        this._hotspot.push({ "rect": rect, "callBack": callBack, "thisObj": thisObj, "para": para });
    };
    p.onTouch = function (e) {
        var x = e.localX;
        var y = e.localY;
        var tempObj;
        for (var i = 0; i < this._hotspot.length; i++) {
            tempObj = this._hotspot[i];
            if (tempObj.rect.contains(x, y)) {
                if (tempObj.para)
                    tempObj.callBack.call(tempObj.thisObj, tempObj.para);
                else
                    tempObj.callBack.call(tempObj.thisObj);
            }
        }
    };
    return HotspotBitmap;
}(egret.Bitmap));
egret.registerClass(HotspotBitmap,'HotspotBitmap');
