/**
 * Created by yangsong on 15-3-20.
 */
var UTFMsgByJson = (function (_super) {
    __extends(UTFMsgByJson, _super);
    /**
     * 构造函数
     */
    function UTFMsgByJson() {
        _super.call(this);
    }
    var d = __define,c=UTFMsgByJson,p=c.prototype;
    /**
     * 消息解析
     * @param msg
     */
    p.decode = function (msg) {
        return JSON.parse(msg);
    };
    /**
     * 消息封装
     * @param msg
     */
    p.encode = function (msg) {
        return JSON.stringify(msg);
    };
    return UTFMsgByJson;
}(UTFMsg));
egret.registerClass(UTFMsgByJson,'UTFMsgByJson');
