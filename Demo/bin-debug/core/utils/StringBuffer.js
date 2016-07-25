/**
 * Created by yangsong on 2014/12/8.
 * StringBuffer类
 */
var StringBuffer = (function () {
    /**
     * 构造函数
     */
    function StringBuffer() {
        this._strings = new Array();
    }
    var d = __define,c=StringBuffer,p=c.prototype;
    /**
     * 追加一个字符串
     * @param str
     */
    p.append = function (str) {
        this._strings.push(str);
    };
    /**
     * 转换为字符串
     * @returns {string}
     */
    p.toString = function () {
        return this._strings.join("");
    };
    /**
     * 清空
     */
    p.clear = function () {
        this._strings.length = 0;
    };
    return StringBuffer;
}());
egret.registerClass(StringBuffer,'StringBuffer');
