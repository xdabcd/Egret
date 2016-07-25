/**
 * Created by yangsong on 2014/11/23.
 * 帧延迟处理
 */
var FrameDelay = (function () {
    /**
     * 构造函数
     */
    function FrameDelay() {
    }
    var d = __define,c=FrameDelay,p=c.prototype;
    /**
     * 延迟处理
     * @param delayFrame 延迟帧数
     * @param func 延迟执行的函数
     * @param thisObj 延迟执行的函数的所属对象
     */
    p.delayCall = function (delayFrame, func, thisObj) {
        this.func = func;
        this.thisObj = thisObj;
        App.TimerManager.doFrame(delayFrame, 1, this.listener_enterFrame, this);
    };
    p.listener_enterFrame = function () {
        this.func.call(this.thisObj);
    };
    return FrameDelay;
}());
egret.registerClass(FrameDelay,'FrameDelay');
