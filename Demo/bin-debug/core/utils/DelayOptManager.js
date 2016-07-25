/**
 * Created by Saco on 2014/8/2.
 */
var DelayOptManager = (function (_super) {
    __extends(DelayOptManager, _super);
    function DelayOptManager() {
        _super.call(this);
        //每帧运算逻辑的时间阈值，执行代码超过这个时间就跳过到下一帧继续执行，根据实际情况调整，因为每一帧除了这里的逻辑还有别的逻辑要做对吧
        this.TIME_THRESHOLD = 2;
        this._delayOpts = [];
        App.TimerManager.doFrame(1, 0, this.runCachedFun, this);
    }
    var d = __define,c=DelayOptManager,p=c.prototype;
    p.addDelayOptFunction = function (thisObj, fun, funPara, callBack, para) {
        this._delayOpts.push({ "fun": fun, "funPara": funPara, "thisObj": thisObj, "callBack": callBack, "para": para });
    };
    p.clear = function () {
        this._delayOpts.length = 0;
    };
    p.stop = function () {
        App.TimerManager.remove(this.runCachedFun, this);
    };
    p.runCachedFun = function (f) {
        if (this._delayOpts.length == 0) {
            return;
        }
        var timeFlag = egret.getTimer();
        var funObj;
        while (this._delayOpts.length) {
            funObj = this._delayOpts.shift();
            if (funObj.funPara)
                funObj.fun.call(funObj.thisObj, funObj.funPara);
            else
                funObj.fun.call(funObj.thisObj);
            if (funObj.callBack) {
                if (funObj.para != undefined)
                    funObj.callBack.call(funObj.thisObj, funObj.para);
                else
                    funObj.callBack();
            }
            if (egret.getTimer() - timeFlag > this.TIME_THRESHOLD)
                break;
        }
    };
    return DelayOptManager;
}(BaseClass));
egret.registerClass(DelayOptManager,'DelayOptManager');
