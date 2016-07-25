/**
 * Created by yangsong on 15-8-19.
 * 队列处理
 */
var QueueExecutor = (function () {
    /**
     * 构造函数
     */
    function QueueExecutor() {
        this._functions = new Array();
    }
    var d = __define,c=QueueExecutor,p=c.prototype;
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    p.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    p.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * 开始执行
     */
    p.start = function () {
        this.next();
    };
    /**
     * 执行下一个
     */
    p.next = function () {
        if (!this._functions) {
            return;
        }
        if (this._functions.length == 0) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
        else {
            var arr = this._functions.shift();
            arr[0].call(arr[1]);
        }
    };
    return QueueExecutor;
}());
egret.registerClass(QueueExecutor,'QueueExecutor');
