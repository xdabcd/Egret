/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
var StringUtils = (function (_super) {
    __extends(StringUtils, _super);
    /**
     * 构造函数
     */
    function StringUtils() {
        _super.call(this);
    }
    var d = __define,c=StringUtils,p=c.prototype;
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    p.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    p.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    p.isChinese = function (str) {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    };
    return StringUtils;
}(BaseClass));
egret.registerClass(StringUtils,'StringUtils');
