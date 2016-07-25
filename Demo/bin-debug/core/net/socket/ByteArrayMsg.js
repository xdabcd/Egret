/**
 * Created by yangsong on 15-2-11.
 */
var ByteArrayMsg = (function () {
    /**
     * 构造函数
     */
    function ByteArrayMsg() {
        this._msgBuffer = new egret.ByteArray();
    }
    var d = __define,c=ByteArrayMsg,p=c.prototype;
    /**
     * 接收消息处理
     * @param msg
     */
    p.receive = function (socket) {
        socket.readBytes(this._msgBuffer);
        var obj = this.decode(this._msgBuffer);
        if (obj) {
            App.MessageCenter.dispatch(obj.key, obj.body);
        }
        //TODO double bytearray clear
        if (this._msgBuffer.bytesAvailable == 0) {
            this._msgBuffer.clear();
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    p.send = function (socket, msg) {
        var obj = this.encode(msg);
        if (obj) {
            obj.position = 0;
            socket.writeBytes(obj, 0, obj.bytesAvailable);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    p.decode = function (msg) {
        Log.trace("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    p.encode = function (msg) {
        Log.trace("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return ByteArrayMsg;
}());
egret.registerClass(ByteArrayMsg,'ByteArrayMsg',["BaseMsg"]);
