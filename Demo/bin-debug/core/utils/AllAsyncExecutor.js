/**
 * Created by yangsong on 15-11-4.
 */
var AllAsyncExecutor = (function () {
    /**
     * 构造函数
     */
    function AllAsyncExecutor() {
        this._functions = new Array();
        this._complateNum = 0;
    }
    var d = __define,c=AllAsyncExecutor,p=c.prototype;
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
        App.ArrayUtils.forEach(this._functions, function (arr) {
            arr[0].call(arr[1]);
        }, this);
    };
    /**
     * 执行完成
     */
    p.complate = function () {
        if (!this._functions) {
            return;
        }
        this._complateNum++;
        if (this._complateNum == this._functions.length) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
    };
    return AllAsyncExecutor;
}());
egret.registerClass(AllAsyncExecutor,'AllAsyncExecutor');
