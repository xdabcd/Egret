/**
 * Created by yangsong on 2014/11/23.
 * Debug调试工具
 */
var DebugUtils = (function (_super) {
    __extends(DebugUtils, _super);
    function DebugUtils() {
        _super.call(this);
        this._threshold = 3;
        this._startTimes = {};
    }
    var d = __define,c=DebugUtils,p=c.prototype;
    /**
     * 设置调试是否开启
     * @param flag
     *
     */
    p.isOpen = function (flag) {
        this._isOpen = flag;
    };
    d(p, "isDebug"
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        ,function () {
            return this._isOpen;
        }
    );
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    p.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
     *
     */
    p.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Log.trace(key + ": " + cha);
        }
        return cha;
    };
    /**
     * 设置时间间隔阈值
     * @param value
     */
    p.setThreshold = function (value) {
        this._threshold = value;
    };
    return DebugUtils;
}(BaseClass));
egret.registerClass(DebugUtils,'DebugUtils');
